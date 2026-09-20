"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemeService = void 0;
const Scheme_js_1 = require("../models/Scheme.js");
const Category_js_1 = require("../models/Category.js");
class SchemeService {
    static async querySchemes(filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Math.min(100, Number(filters.limit) || 12));
        const skip = (page - 1) * limit;
        const query = {};
        if (filters.status) {
            query.status = filters.status;
        }
        else {
            query.status = 'Active';
        }
        if (filters.category) {
            const cat = await Category_js_1.Category.findOne({
                $or: [{ _id: filters.category.match(/^[0-9a-fA-F]{24}$/) ? filters.category : null }, { slug: filters.category }],
            });
            if (cat) {
                query.category = cat._id;
            }
        }
        if (filters.benefitType && filters.benefitType !== 'All') {
            query.benefitType = filters.benefitType;
        }
        if (filters.state && filters.state !== 'All') {
            query['eligibilityCriteria.eligibleStates'] = { $in: ['All', 'National', filters.state] };
        }
        if (filters.gender && filters.gender !== 'All') {
            query['eligibilityCriteria.gender'] = { $in: ['All', filters.gender] };
        }
        if (filters.search && filters.search.trim()) {
            query.$text = { $search: filters.search.trim() };
        }
        const sortOptions = {};
        if (filters.sortBy === 'popular') {
            sortOptions.viewsCount = -1;
        }
        else if (filters.sortBy === 'oldest') {
            sortOptions.createdAt = 1;
        }
        else {
            sortOptions.createdAt = -1;
        }
        const [schemes, total] = await Promise.all([
            Scheme_js_1.Scheme.find(query).populate('category').sort(sortOptions).skip(skip).limit(limit),
            Scheme_js_1.Scheme.countDocuments(query),
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
    static async getSchemeBySlug(slug) {
        const scheme = await Scheme_js_1.Scheme.findOneAndUpdate({ slug }, { $inc: { viewsCount: 1 } }, { new: true }).populate('category');
        return scheme;
    }
    static async createScheme(data) {
        if (!data.slug && data.title) {
            data.slug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
        }
        const scheme = await Scheme_js_1.Scheme.create(data);
        await Category_js_1.Category.findByIdAndUpdate(scheme.category, { $inc: { schemeCount: 1 } });
        return scheme;
    }
    static async updateScheme(id, data) {
        return await Scheme_js_1.Scheme.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }
    static async deleteScheme(id) {
        const scheme = await Scheme_js_1.Scheme.findByIdAndDelete(id);
        if (scheme) {
            await Category_js_1.Category.findByIdAndUpdate(scheme.category, { $inc: { schemeCount: -1 } });
            return true;
        }
        return false;
    }
}
exports.SchemeService = SchemeService;
//# sourceMappingURL=scheme.service.js.map