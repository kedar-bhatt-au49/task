const mockGet = jest.fn();

jest.mock('axios', () => ({
  create: jest.fn(() => ({ get: mockGet })),
}));

const DictionaryService = require('../src/services/DictionaryService');

describe('DictionaryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch word data successfully', async () => {
    const mockResponse = {
      data: [{
        meanings: [{
          partOfSpeech: 'noun',
          definitions: [{
            definition: 'A building for human habitation',
            example: 'They moved into a new house.',
          }],
        }],
      }],
    };

    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await DictionaryService.fetchWordData('house');

    expect(result).toEqual({
      definition: 'A building for human habitation',
      example: 'They moved into a new house.',
      partOfSpeech: 'noun',
    });
    expect(mockGet).toHaveBeenCalledWith(
      'https://api.dictionaryapi.dev/api/v2/entries/en/house'
    );
  });

  it('should handle 404 from dictionary API', async () => {
    mockGet.mockRejectedValueOnce({
      response: { status: 404 },
    });

    await expect(DictionaryService.fetchWordData('xyzzy'))
      .rejects
      .toThrow('Word "xyzzy" not found in dictionary');
  });

  it('should retry on timeout', async () => {
    mockGet
      .mockRejectedValueOnce({ code: 'ECONNABORTED' })
      .mockResolvedValueOnce({
        data: [{
          meanings: [{
            definitions: [{ definition: 'Test', example: '' }],
          }],
        }],
      });

    const result = await DictionaryService.fetchWordData('test');

    expect(result.definition).toBe('Test');
    expect(mockGet).toHaveBeenCalledTimes(2);
  });

  it('should throw after exhausting retries', async () => {
    mockGet.mockRejectedValue({ code: 'ECONNABORTED' });

    await expect(DictionaryService.fetchWordData('test'))
      .rejects
      .toThrow('Dictionary API timed out');
    expect(mockGet).toHaveBeenCalledTimes(3);
  });

  it('should handle missing definition gracefully', async () => {
    mockGet.mockResolvedValueOnce({
      data: [{ meanings: [] }],
    });

    const result = await DictionaryService.fetchWordData('test');
    expect(result.definition).toBe('No definition found');
  });
});
