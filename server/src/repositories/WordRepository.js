const Word = require('../models/Word');
const { sanitizeSearch } = require('../utils/searchSanitizer');

class WordRepository {
  async findByUserIdAndWord(userId, word) {
    return Word.findOne({ userId, word: word.toLowerCase().trim() }).lean();
  }

  async create(data) {
    const doc = await Word.create(data);
    return doc.toObject();
  }

  async findAllByUserId(userId, search = '', page = 1, limit = 50) {
    const query = { userId };
    if (search) {
      const sanitized = sanitizeSearch(search);
      if (sanitized) {
        query.word = { $regex: sanitized, $options: 'i' };
      }
    }

    const skip = (page - 1) * limit;

    const [words, total] = await Promise.all([
      Word.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Word.countDocuments(query),
    ]);

    return { words, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findDueForReview(userId) {
    return Word.find({
      userId,
      nextReviewAt: { $lte: new Date() },
    }).sort({ nextReviewAt: 1 }).lean();
  }

  async findById(id) {
    return Word.findById(id).lean();
  }

  async updateReview(id, reviewCount, nextReviewAt, lastReviewedAt) {
    return Word.findByIdAndUpdate(
      id,
      { reviewCount, nextReviewAt, lastReviewedAt },
      { new: true, lean: true }
    );
  }

  async advanceTime(userId) {
    return Word.updateMany(
      { userId },
      { nextReviewAt: new Date() }
    );
  }
}

module.exports = new WordRepository();
