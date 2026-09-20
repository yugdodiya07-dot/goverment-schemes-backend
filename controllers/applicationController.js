const Application = require('../models/Application');
const Scheme = require('../models/Scheme');

// @desc    Submit a new scheme application
// @route   POST /api/applications
// @access  Private
const submitApplication = async (req, res, next) => {
  try {
    const {
      schemeId,
      applicantName,
      email,
      phone,
      aadharNumber,
      state,
      district,
      address,
      occupation,
      annualIncome,
      category,
      remarks,
    } = req.body;

    if (!schemeId || !applicantName || !phone || !aadharNumber) {
      return res.status(400).json({
        success: false,
        message: 'Scheme ID, Applicant Name, Mobile Number, and Aadhaar Number are required.',
      });
    }

    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Target government scheme not found.',
      });
    }

    // Check if citizen already submitted an active application for this scheme
    const existingApp = await Application.findOne({
      user: req.user._id,
      scheme: schemeId,
      status: { $in: ['Submitted', 'Under Verification', 'Document Verified', 'Approved'] },
    });

    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an active application for this scheme.',
      });
    }

    // Process uploaded documents
    const documents = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        documents.push({
          documentType: file.fieldname || 'Attachment',
          filename: file.filename,
          path: `/uploads/${file.filename}`,
          uploadedAt: new Date(),
        });
      });
    }

    // Default 4-stage tracking timeline
    const timeline = [
      {
        stage: 'Submitted',
        status: 'completed',
        title: 'Application Received',
        comment: 'Application submitted successfully with attached supporting documents.',
        timestamp: new Date(),
        officerName: 'GovSmart Portal System',
      },
      {
        stage: 'Under Verification',
        status: 'current',
        title: 'Officer Review & Screening',
        comment: 'Application is awaiting initial screening by assigned department officer.',
        timestamp: new Date(),
        officerName: 'Verification Officer',
      },
      {
        stage: 'Document Verified',
        status: 'pending',
        title: 'Document Authentication',
        comment: 'Supporting KYC and income certificates are pending verification.',
        timestamp: new Date(),
        officerName: 'Verification Officer',
      },
      {
        stage: 'Approved',
        status: 'pending',
        title: 'Final Benefit Sanction',
        comment: 'Pending final sanction order and benefit disbursement.',
        timestamp: new Date(),
        officerName: 'Sanctioning Officer',
      },
    ];

    const application = await Application.create({
      user: req.user._id,
      scheme: schemeId,
      applicantName,
      email: email || req.user.email,
      phone,
      aadharNumber,
      state: state || req.user.state || 'All',
      district: district || req.user.district || '',
      address: address || req.user.address || '',
      occupation: occupation || req.user.occupation || '',
      annualIncome: annualIncome ? Number(annualIncome) : req.user.annualIncome || 0,
      category: category || req.user.category || 'General',
      status: 'Submitted',
      remarks: remarks || 'Application submitted successfully.',
      documents,
      timeline,
    });

    // Increment scheme application count
    scheme.applicationCount = (scheme.applicationCount || 0) + 1;
    await scheme.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! You can track real-time progress on your dashboard.',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in citizen's applications
// @route   GET /api/applications/my-applications
// @access  Private
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('scheme')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (Admin Only, with pagination and filtering)
// @route   GET /api/applications
// @access  Private/Admin
const getAllApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 15, status = '', search = '', schemeId = '' } = req.query;

    const query = {};

    if (status && status !== 'All' && status !== '') {
      query.status = status;
    }

    if (schemeId && schemeId !== '') {
      query.scheme = schemeId;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { applicantName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { aadharNumber: searchRegex },
      ];
    }

    const totalItems = await Application.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const currentPage = Math.max(1, Math.min(Number(page), totalPages));

    const applications = await Application.find(query)
      .populate('scheme', 'title code category ministry benefitAmount')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: applications,
      pagination: {
        totalItems,
        totalPages,
        currentPage,
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status and remarks (Admin Only)
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status to update.',
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    application.status = status;
    if (remarks) {
      application.remarks = remarks;
    }

    const now = new Date();
    const adminName = req.user.name || 'Government Verification Officer';

    // Update the 4-stage tracking timeline dynamically
    if (status === 'Under Verification') {
      application.timeline[1].status = 'current';
      application.timeline[1].comment = remarks || 'Application is undergoing thorough officer screening.';
      application.timeline[1].timestamp = now;
      application.timeline[1].officerName = adminName;
    } else if (status === 'Document Verified') {
      application.timeline[0].status = 'completed';
      application.timeline[1].status = 'completed';
      application.timeline[2].status = 'current';
      application.timeline[2].comment = remarks || 'All KYC and income documents have been verified.';
      application.timeline[2].timestamp = now;
      application.timeline[2].officerName = adminName;
    } else if (status === 'Approved') {
      application.timeline[0].status = 'completed';
      application.timeline[1].status = 'completed';
      application.timeline[2].status = 'completed';
      application.timeline[3].status = 'completed';
      application.timeline[3].comment = remarks || 'Application formally approved! Sanction order issued.';
      application.timeline[3].timestamp = now;
      application.timeline[3].officerName = adminName;
    } else if (status === 'Rejected') {
      application.timeline.forEach((item, idx) => {
        if (idx === 0) item.status = 'completed';
        else item.status = 'rejected';
      });
      application.timeline[1].title = 'Application Rejected';
      application.timeline[1].comment = remarks || 'Application rejected due to eligibility or document mismatch.';
      application.timeline[1].timestamp = now;
      application.timeline[1].officerName = adminName;
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status} successfully!`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an application (Admin Only)
// @route   DELETE /api/applications/:id
// @access  Private/Admin
const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    await Application.findByIdAndDelete(req.params.id);

    // Decrement applicationCount on target Scheme safely
    if (application.scheme) {
      await Scheme.findByIdAndUpdate(application.scheme, {
        $inc: { applicationCount: -1 },
      });
      await Scheme.updateOne(
        { _id: application.scheme, applicationCount: { $lt: 0 } },
        { $set: { applicationCount: 0 } }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Application record removed successfully!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitApplication,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
};
