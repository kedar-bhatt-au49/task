const axios = require('axios');
const { AppError } = require('../middleware/errorHandler');

const DICTIONARY_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

const axiosInstance = axios.create({
  timeout: 5000,
});

class DictionaryService {
  async fetchWordData(word, retries = 2) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await axiosInstance.get(
          `${DICTIONARY_API_URL}/${encodeURIComponent(word)}`
        );
        const data = response.data[0];

        const definition = data.meanings[0]?.definitions[0]?.definition || 'No definition found';
        const example = data.meanings[0]?.definitions[0]?.example || '';
        const partOfSpeech = data.meanings[0]?.partOfSpeech || '';

        return { definition, example, partOfSpeech };
      } catch (error) {
        if (error.response?.status === 404) {
          throw new AppError(`Word "${word}" not found in dictionary`, 404);
        }

        if (error.code === 'ECONNABORTED') {
          if (attempt < retries) {
            continue;
          }
          throw new AppError('Dictionary API timed out. Please try again.', 504);
        }

        if (attempt === retries) {
          throw new AppError('Failed to fetch word definition. Please try again.', 502);
        }
      }
    }
  }
}

module.exports = new DictionaryService();
