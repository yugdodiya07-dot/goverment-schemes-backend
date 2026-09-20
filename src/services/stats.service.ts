import { Scheme } from '../models/Scheme.js';
import { Application } from '../models/Application.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { SavedScheme } from '../models/SavedScheme.js';

export class StatsService {
  public static async getAdminOverview() {
    const [
      totalSchemes,
      totalCitizens,
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      categories,
    ] = await Promise.all([
      Scheme.countDocuments({ status: 'Active' }),
      User.countDocuments({ status: 'Active' }),
      Application.countDocuments(),
      Application.countDocuments({ status: { $in: ['Submitted', 'Under Review', 'Document Verification'] } }),
      Application.countDocuments({ status: 'Approved' }),
      Application.countDocuments({ status: 'Rejected' }),
      Category.find().select('name slug schemeCount'),
    ]);

    const approvalRate = totalApplications > 0 ? Math.round((approvedApplications / totalApplications) * 100) : 0;

    return {
      totalSchemes,
      totalCitizens,
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      approvalRate,
      categories,
    };
  }

  public static async getCitizenStats(userId: string) {
    const [appliedCount, savedCount, recentApplications] = await Promise.all([
      Application.countDocuments({ user: userId }),
      SavedScheme.countDocuments({ user: userId }),
      Application.find({ user: userId }).populate('scheme', 'title category ministry').sort({ createdAt: -1 }).limit(5),
    ]);

    return {
      appliedCount,
      savedCount,
      recentApplications,
    };
  }
}
