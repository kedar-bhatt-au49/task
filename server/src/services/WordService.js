const { AppError } = require('../middleware/errorHandler');
const DictionaryService = require('./DictionaryService');
const WordRepository = require('../repositories/WordRepository');
const ConfigRepository = require('../repositories/ConfigRepository');

class WordService {
  async addWord(userId, word) {
    const trimmedWord = word.trim().toLowerCase();

    const existing = await WordRepository.findByUserIdAndWord(userId, trimmedWord);
    if (existing) {
      throw new AppError(`Word "${trimmedWord}" already exists in your vocabulary`, 409);
    }

    const { definition, example, partOfSpeech } = await DictionaryService.fetchWordData(trimmedWord);

    return WordRepository.create({
      userId,
      word: trimmedWord,
      definition,
      example,
      partOfSpeech: partOfSpeech || '',
    });
  }

  async listWords(userId, search, page = 1, limit = 50) {
    return WordRepository.findAllByUserId(userId, search, page, limit);
  }

  async getReviewWords(userId) {
    return WordRepository.findDueForReview(userId);
  }

  async reviewWord(id, gotItRight) {
    const word = await WordRepository.findById(id);
    if (!word) {
      throw new AppError('Word not found', 404);
    }

    const devMode = await ConfigRepository.get('devMode');

    const minutes = devMode
      ? (gotItRight ? 3 : 1)
      : (gotItRight ? 3 * 24 * 60 : 24 * 60);

    const nextReviewAt = new Date(Date.now() + minutes * 60 * 1000);

    return WordRepository.updateReview(id, word.reviewCount + 1, nextReviewAt, new Date());
  }

  async advanceTime(userId) {
    return WordRepository.advanceTime(userId);
  }
}

module.exports = new WordService();
