"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheme = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const schemeSchema = new mongoose_1.Schema({
    title: { type: String, required: [true, 'Please provide scheme title'], trim: true },
    slug: { type: String, required: true, trim: true, unique: true, lowercase: true },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', required: true },
    ministry: { type: String, required: true, trim: true },
    department: { type: String, default: '' },
    benefitType: {
        type: String,
        enum: ['Direct Benefit Transfer', 'Subsidy', 'Loan / Credit', 'Insurance', 'Skill Training', 'In-Kind Support'],
        default: 'Direct Benefit Transfer',
    },
    financialBenefit: { type: String, required: true },
    eligibilityCriteria: {
        minAge: { type: Number, default: 0 },
        maxAge: { type: Number, default: 100 },
        gender: { type: String, enum: ['All', 'Male', 'Female', 'Transgender'], default: 'All' },
        maxIncome: { type: Number, default: 100000000 },
        eligibleStates: [{ type: String }],
        eligibleOccupations: [{ type: String }],
        eligibleCategories: [{ type: String }],
        requiresDisability: { type: Boolean, default: false },
        requiredSpecialStatus: [{ type: String }],
    },
    requiredDocuments: [{ type: String }],
    applicationProcess: [{ type: String }],
    officialUrl: { type: String, default: '' },
    helplineNumber: { type: String, default: '1800-111-999' },
    tags: [{ type: String }],
    bannerImage: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Draft', 'Archived'], default: 'Active' },
    viewsCount: { type: Number, default: 0 },
    applicationsCount: { type: Number, default: 0 },
}, { timestamps: true, collection: 'schemes' });
schemeSchema.index({ title: 'text', shortDescription: 'text', ministry: 'text', tags: 'text' });
schemeSchema.index({ category: 1, status: 1 });
exports.Scheme = mongoose_1.default.model('Scheme', schemeSchema);
//# sourceMappingURL=Scheme.js.map