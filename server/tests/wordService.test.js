const WordService = require('../src/services/WordService');
const DictionaryService = require('../src/services/DictionaryService');
const WordRepository = require('../src/repositories/WordRepository');
const ConfigRepository = require('../src/repositories/ConfigRepository');

jest.mock('../src/services/DictionaryService');
jest.mock('../src/repositories/WordRepository');
jest.mock('../src/repositories/ConfigRepository');

describe('WordService', () => {
  const USER_ID = 'test-user';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addWord', () => {
    it('should add a new word successfully', async () => {
      WordRepository.findByUserIdAndWord.mockResolvedValueOnce(null);
      DictionaryService.fetchWordData.mockResolvedValueOnce({
        definition: 'A building for human habitation',
        example: 'They moved into a new house.',
        partOfSpeech: 'noun',
      });
      WordRepository.create.mockResolvedValueOnce({
        _id: '123',
        userId: USER_ID,
        word: 'house',
        definition: 'A building for human habitation',
        example: 'They moved into a new house.',
      });

      const result = await WordService.addWord(USER_ID, '  House  ');

      expect(result.word).toBe('house');
      expect(WordRepository.findByUserIdAndWord).toHaveBeenCalledWith(USER_ID, 'house');
      expect(DictionaryService.fetchWordData).toHaveBeenCalledWith('house');
      expect(WordRepository.create).toHaveBeenCalledWith({
        userId: USER_ID,
        word: 'house',
        definition: 'A building for human habitation',
        example: 'They moved into a new house.',
        partOfSpeech: 'noun',
      });
    });

    it('should throw on duplicate word', async () => {
      WordRepository.findByUserIdAndWord.mockResolvedValueOnce({ word: 'house' });

      await expect(WordService.addWord(USER_ID, 'house'))
        .rejects
        .toThrow('already exists');
    });
  });

  describe('reviewWord', () => {
    const mockWord = {
      _id: '123',
      reviewCount: 2,
    };

    it('should schedule 3 days when gotItRight is true', async () => {
      WordRepository.findById.mockResolvedValueOnce(mockWord);
      ConfigRepository.get.mockResolvedValueOnce(false);
      WordRepository.updateReview.mockResolvedValueOnce({});

      await WordService.reviewWord('123', true);

      const updateCall = WordRepository.updateReview.mock.calls[0];
      const nextReviewAt = updateCall[2];
      const diffMs = nextReviewAt.getTime() - Date.now();
      const diffHours = diffMs / (1000 * 60 * 60);

      expect(diffHours).toBeGreaterThanOrEqual(71);
      expect(diffHours).toBeLessThanOrEqual(73);
      expect(updateCall[1]).toBe(3);
    });

    it('should schedule 1 day when gotItRight is false', async () => {
      WordRepository.findById.mockResolvedValueOnce(mockWord);
      ConfigRepository.get.mockResolvedValueOnce(false);
      WordRepository.updateReview.mockResolvedValueOnce({});

      await WordService.reviewWord('123', false);

      const updateCall = WordRepository.updateReview.mock.calls[0];
      const nextReviewAt = updateCall[2];
      const diffMs = nextReviewAt.getTime() - Date.now();
      const diffHours = diffMs / (1000 * 60 * 60);

      expect(diffHours).toBeGreaterThanOrEqual(23);
      expect(diffHours).toBeLessThanOrEqual(25);
      expect(updateCall[1]).toBe(3);
    });

    it('should use minutes in dev mode', async () => {
      WordRepository.findById.mockResolvedValueOnce(mockWord);
      ConfigRepository.get.mockResolvedValueOnce(true);
      WordRepository.updateReview.mockResolvedValueOnce({});

      await WordService.reviewWord('123', true);
      const updateCall = WordRepository.updateReview.mock.calls[0];
      const nextReviewAt = updateCall[2];
      const diffMs = nextReviewAt.getTime() - Date.now();
      const diffMinutes = diffMs / (1000 * 60);

      expect(diffMinutes).toBeGreaterThanOrEqual(2);
      expect(diffMinutes).toBeLessThanOrEqual(4);
    });

    it('should throw when word is not found', async () => {
      WordRepository.findById.mockResolvedValueOnce(null);

      await expect(WordService.reviewWord('123', true))
        .rejects
        .toThrow('Word not found');
    });
  });
});
