const WordService = require('../services/WordService');
const ConfigRepository = require('../repositories/ConfigRepository');

const USER_ID = 'test-user';

class WordController {
  async addWord(req, res, next) {
    try {
      const { word } = req.body;
      const result = await WordService.addWord(USER_ID, word);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async listWords(req, res, next) {
    try {
      const { search, page, limit } = req.query;
      const hasPagination = page || limit;
      const result = await WordService.listWords(
        USER_ID,
        search || '',
        parseInt(page, 10) || 1,
        parseInt(limit, 10) || 50
      );
      if (hasPagination) {
        res.json(result);
      } else {
        res.json(result.words);
      }
    } catch (error) {
      next(error);
    }
  }

  async getReviewWords(req, res, next) {
    try {
      const words = await WordService.getReviewWords(USER_ID);
      res.json(words);
    } catch (error) {
      next(error);
    }
  }

  async reviewWord(req, res, next) {
    try {
      const { id } = req.params;
      const { gotItRight } = req.body;
      const result = await WordService.reviewWord(id, gotItRight);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async advanceTime(req, res, next) {
    try {
      await WordService.advanceTime(USER_ID);
      res.json({ message: 'All words are now due for review' });
    } catch (error) {
      next(error);
    }
  }

  async devMode(req, res, next) {
    try {
      const { enabled } = req.body;
      await ConfigRepository.set('devMode', enabled);
      res.json({ devMode: enabled });
    } catch (error) {
      next(error);
    }
  }

  async getDevMode(req, res, next) {
    try {
      const devMode = await ConfigRepository.get('devMode');
      res.json({ devMode: !!devMode });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WordController();
