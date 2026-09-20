import { SavedScheme, ISavedScheme } from '../models/SavedScheme.js';
import { Scheme } from '../models/Scheme.js';
import { Types } from 'mongoose';

export class SavedSchemeService {
  /**
   * Fetch all saved schemes for a given user with populated scheme and category details
   */
  public static async getUserSavedSchemes(userId: string | Types.ObjectId): Promise<ISavedScheme[]> {
    const list = await SavedScheme.find({ user: userId })
      .populate({
        path: 'scheme',
        populate: {
          path: 'category',
          select: 'name slug icon',
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    // Filter out null schemes if a scheme was deleted
    return list.filter((item) => item.scheme != null) as unknown as ISavedScheme[];
  }

  /**
   * Get array of scheme ID strings saved by user for fast client-side lookup
   */
  public static async getUserSavedSchemeIds(userId: string | Types.ObjectId): Promise<string[]> {
    const list = await SavedScheme.find({ user: userId }).select('scheme').lean();
    return list.map((item) => item.scheme.toString());
  }

  /**
   * Check if a specific scheme is saved by the user
   */
  public static async isSchemeSaved(
    userId: string | Types.ObjectId,
    schemeId: string | Types.ObjectId
  ): Promise<boolean> {
    const count = await SavedScheme.countDocuments({ user: userId, scheme: schemeId });
    return count > 0;
  }

  /**
   * Toggle save state (save if not saved, remove if already saved)
   */
  public static async toggleSaveScheme(
    userId: string | Types.ObjectId,
    schemeId: string | Types.ObjectId,
    notes?: string
  ): Promise<{ isSaved: boolean; message: string; savedScheme?: ISavedScheme }> {
    const existing = await SavedScheme.findOne({ user: userId, scheme: schemeId });

    if (existing) {
      await SavedScheme.findByIdAndDelete(existing._id);
      return {
        isSaved: false,
        message: 'Scheme removed from your saved watchlist.',
      };
    }

    // Verify scheme exists
    const schemeExists = await Scheme.findById(schemeId);
    if (!schemeExists) {
      throw new Error('Scheme not found.');
    }

    const saved = await SavedScheme.create({
      user: userId,
      scheme: schemeId,
      notes: notes || '',
    });

    const populated = await SavedScheme.findById(saved._id).populate({
      path: 'scheme',
      populate: { path: 'category', select: 'name slug icon' },
    });

    return {
      isSaved: true,
      message: 'Scheme successfully added to your saved watchlist.',
      savedScheme: populated || saved,
    };
  }

  /**
   * Explicitly remove a saved scheme
   */
  public static async unsaveScheme(
    userId: string | Types.ObjectId,
    schemeId: string | Types.ObjectId
  ): Promise<boolean> {
    const result = await SavedScheme.findOneAndDelete({ user: userId, scheme: schemeId });
    return !!result;
  }

  /**
   * Update personal notes on a saved scheme
   */
  public static async updateNotes(
    userId: string | Types.ObjectId,
    schemeId: string | Types.ObjectId,
    notes: string
  ): Promise<ISavedScheme | null> {
    const updated = await SavedScheme.findOneAndUpdate(
      { user: userId, scheme: schemeId },
      { notes },
      { new: true }
    );
    return updated;
  }
}
