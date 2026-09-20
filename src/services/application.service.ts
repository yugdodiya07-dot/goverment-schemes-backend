import { Application, IApplication } from '../models/Application.js';
import { Scheme } from '../models/Scheme.js';
import { Notification } from '../models/Notification.js';
import { ApplicationStatus } from '../types/index.js';

export class ApplicationService {
  private static generateAppNumber(): string {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `GS-${new Date().getFullYear()}-${random}`;
  }

  public static async submitApplication(
    userId: string,
    schemeId: string,
    formData: Record<string, any>,
    documents: Array<{ documentName: string; documentType: string; fileUrl: string }>,
    eligibilityScore: number = 100
  ): Promise<IApplication> {
    const appNumber = this.generateAppNumber();

    const application = await Application.create({
      applicationNumber: appNumber,
      user: userId,
      scheme: schemeId,
      formData,
      documents,
      eligibilityScore,
      status: 'Submitted',
      statusHistory: [
        {
          status: 'Submitted',
          comment: 'Application submitted successfully by citizen.',
          updatedAt: new Date(),
        },
      ],
    });

    await Scheme.findByIdAndUpdate(schemeId, { $inc: { applicationsCount: 1 } });

    // Notify citizen
    await Notification.create({
      recipient: userId,
      recipientType: 'User',
      title: 'Application Submitted Successfully',
      message: `Your application #${appNumber} has been received and is queued for verification.`,
      type: 'success',
      link: `/applications/${application._id}`,
    });

    return application;
  }

  public static async getCitizenApplications(userId: string) {
    return await Application.find({ user: userId })
      .populate('scheme')
      .sort({ createdAt: -1 });
  }

  public static async getAllApplications(filters: { status?: string; schemeId?: string; search?: string; page?: number; limit?: number }) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(filters.limit) || 15));
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};
    if (filters.status && filters.status !== 'All') {
      query.status = filters.status;
    }
    if (filters.schemeId) {
      query.scheme = filters.schemeId;
    }
    if (filters.search) {
      query.applicationNumber = { $regex: filters.search.trim(), $options: 'i' };
    }

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate('user', 'name email phone state category')
        .populate('scheme', 'title category ministry benefitType')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments(query),
    ]);

    return {
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public static async updateApplicationStatus(
    appId: string,
    newStatus: ApplicationStatus,
    comment: string,
    adminId: string
  ): Promise<IApplication | null> {
    const application = await Application.findById(appId);
    if (!application) {
      throw new Error('Application not found');
    }

    application.status = newStatus;
    application.adminRemarks = comment;
    if (newStatus === 'Approved' || newStatus === 'Rejected') {
      application.processedAt = new Date();
    }

    application.statusHistory.push({
      status: newStatus,
      comment: comment || `Status updated to ${newStatus}`,
      updatedBy: adminId,
      updatedAt: new Date(),
    });

    await application.save();

    // Notify citizen about status change
    await Notification.create({
      recipient: application.user,
      recipientType: 'User',
      title: `Application Update: ${newStatus}`,
      message: `Your application #${application.applicationNumber} status changed to ${newStatus}. Note: ${comment || 'No remarks provided.'}`,
      type: newStatus === 'Approved' ? 'success' : newStatus === 'Rejected' ? 'alert' : 'info',
      link: `/applications/${application._id}`,
    });

    return application;
  }
}
