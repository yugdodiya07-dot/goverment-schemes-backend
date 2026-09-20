import { Scheme, IScheme } from '../models/Scheme.js';
import { Category } from '../models/Category.js';

export interface ISchemeQueryFilters {
  search?: string;
  category?: string;
  benefitType?: string;
  state?: string;
  schemeLevel?: 'Central' | 'State' | 'All' | string;
  stateOnly?: boolean | string;
  gender?: string;
  occupation?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export class SchemeService {
  public static async querySchemes(filters: ISchemeQueryFilters) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Math.min(250, Number(filters.limit) || 120));
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};

    if (filters.status) {
      query.status = filters.status;
    } else {
      query.status = 'Active';
    }

    if (filters.category) {
      const cat = await Category.findOne({
        $or: [{ _id: filters.category.match(/^[0-9a-fA-F]{24}$/) ? filters.category : null }, { slug: filters.category }],
      });
      if (cat) {
        query.category = cat._id;
      }
    }

    if (filters.benefitType && filters.benefitType !== 'All') {
      query.benefitType = filters.benefitType;
    }

    if (filters.schemeLevel && filters.schemeLevel !== 'All') {
      query.schemeLevel = filters.schemeLevel;
    }

    if (filters.state && filters.state !== 'All') {
      const isStateOnly = filters.stateOnly === true || filters.stateOnly === 'true' || filters.schemeLevel === 'State';
      if (isStateOnly) {
        query.$or = [
          { state: filters.state },
          { 'eligibilityCriteria.eligibleStates': filters.state },
        ];
      } else {
        query.$or = [
          { 'eligibilityCriteria.eligibleStates': { $in: ['All', 'National', 'All India', filters.state] } },
          { state: { $in: ['All India', 'National', filters.state] } },
        ];
      }
    }

    if (filters.gender && filters.gender !== 'All') {
      query['eligibilityCriteria.gender'] = { $in: ['All', filters.gender] };
    }

    if (filters.search && filters.search.trim()) {
      query.$text = { $search: filters.search.trim() };
    }

    const sortOptions: Record<string, 1 | -1> = {};
    if (filters.sortBy === 'popular') {
      sortOptions.viewsCount = -1;
    } else if (filters.sortBy === 'oldest') {
      sortOptions.createdAt = 1;
    } else {
      sortOptions.createdAt = -1;
    }

    const [schemes, total] = await Promise.all([
      Scheme.find(query).populate('category').sort(sortOptions).skip(skip).limit(limit),
      Scheme.countDocuments(query),
    ]);

    return {
      schemes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public static async getSchemeBySlug(slug: string): Promise<IScheme | null> {
    const scheme = await Scheme.findOneAndUpdate({ slug }, { $inc: { viewsCount: 1 } }, { new: true }).populate('category');
    return scheme;
  }

  public static async createScheme(data: Partial<IScheme>): Promise<IScheme> {
    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    const scheme = await Scheme.create(data);
    await Category.findByIdAndUpdate(scheme.category, { $inc: { schemeCount: 1 } });
    return scheme;
  }

  public static async updateScheme(id: string, data: Partial<IScheme>): Promise<IScheme | null> {
    return await Scheme.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  public static async deleteScheme(id: string): Promise<boolean> {
    const scheme = await Scheme.findByIdAndDelete(id);
    if (scheme) {
      await Category.findByIdAndUpdate(scheme.category, { $inc: { schemeCount: -1 } });
      return true;
    }
    return false;
  }

  public static async getStatesSummary() {
    const stateCounts = await Scheme.aggregate([
      { $match: { status: 'Active', schemeLevel: 'State' } },
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const centralCount = await Scheme.countDocuments({ status: 'Active', schemeLevel: 'Central' });
    const totalCount = await Scheme.countDocuments({ status: 'Active' });

    return {
      centralCount,
      totalCount,
      states: stateCounts.map((s) => ({ state: s._id, count: s.count })),
    };
  }
}
