const express = require('express');
const router = express.Router();
const WordController = require('../controllers/WordController');
const { addWordRules, reviewWordRules, devModeRules, searchQueryRules } = require('../middleware/validate');

router.post('/words', addWordRules, (req, res, next) => WordController.addWord(req, res, next));
router.get('/words', searchQueryRules, (req, res, next) => WordController.listWords(req, res, next));
router.get('/words/review', (req, res, next) => WordController.getReviewWords(req, res, next));
router.put('/words/:id/review', reviewWordRules, (req, res, next) => WordController.reviewWord(req, res, next));
router.post('/dev/advance', (req, res, next) => WordController.advanceTime(req, res, next));
router.post('/dev/mode', devModeRules, (req, res, next) => WordController.devMode(req, res, next));
router.get('/dev/mode', (req, res, next) => WordController.getDevMode(req, res, next));

module.exports = router;
