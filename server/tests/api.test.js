const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const Word = require('../src/models/Word');

let mongoServer;
let app;
const USER_ID = 'test-user';

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  app = require('../src/index');
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  await Word.deleteMany({});
});

describe('GET /health', () => {
  it('should return ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('POST /api/words', () => {
  it('should reject missing word', async () => {
    const res = await request(app).post('/api/words').send({});
    expect(res.status).toBe(400);
  });

  it('should reject word with invalid characters', async () => {
    const res = await request(app).post('/api/words').send({ word: 'hello@world' });
    expect(res.status).toBe(400);
  });

  it('should create a word and fetch definition', async () => {
    const res = await request(app).post('/api/words').send({ word: 'house' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('word', 'house');
  }, 15000);

  it('should reject duplicate word', async () => {
    await request(app).post('/api/words').send({ word: 'house' });
    const res = await request(app).post('/api/words').send({ word: 'house' });
    expect(res.status).toBe(409);
  }, 15000);
});

describe('GET /api/words', () => {
  beforeEach(async () => {
    await Word.create([
      { userId: USER_ID, word: 'apple', definition: 'A fruit', nextReviewAt: new Date() },
      { userId: USER_ID, word: 'banana', definition: 'A yellow fruit', nextReviewAt: new Date() },
    ]);
  });

  it('should list words', async () => {
    const res = await request(app).get('/api/words');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('should search words', async () => {
    const res = await request(app).get('/api/words?search=apple');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });
});

describe('GET /api/words/review', () => {
  beforeEach(async () => {
    await Word.create([
      { userId: USER_ID, word: 'due1', definition: 'Due word 1', nextReviewAt: new Date(Date.now() - 3600000) },
      { userId: USER_ID, word: 'future', definition: 'Future word', nextReviewAt: new Date(Date.now() + 86400000) },
    ]);
  });

  it('should return only due words', async () => {
    const res = await request(app).get('/api/words/review');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].word).toBe('due1');
  });
});

describe('PUT /api/words/:id/review', () => {
  let wordId;

  beforeEach(async () => {
    const word = await Word.create({
      userId: USER_ID,
      word: 'testword',
      definition: 'A test word',
      reviewCount: 0,
      nextReviewAt: new Date(),
    });
    wordId = word._id.toString();
  });

  it('should reject invalid id', async () => {
    const res = await request(app).put('/api/words/invalid/review').send({ gotItRight: true });
    expect(res.status).toBe(400);
  });

  it('should mark word as correct', async () => {
    const res = await request(app).put(`/api/words/${wordId}/review`).send({ gotItRight: true });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('reviewCount', 1);
  });

  it('should return 404 for non-existent word', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).put(`/api/words/${fakeId}/review`).send({ gotItRight: true });
    expect(res.status).toBe(404);
  });
});

describe('POST /api/dev/advance', () => {
  beforeEach(async () => {
    await Word.create([
      { userId: USER_ID, word: 'word1', definition: 'Word 1', nextReviewAt: new Date(Date.now() + 86400000) },
    ]);
  });

  it('should advance time', async () => {
    const res = await request(app).post('/api/dev/advance');
    expect(res.status).toBe(200);
    const dueWords = await Word.find({ nextReviewAt: { $lte: new Date() } });
    expect(dueWords.length).toBe(1);
  });
});

describe('POST /api/dev/mode', () => {
  it('should enable dev mode', async () => {
    const res = await request(app).post('/api/dev/mode').send({ enabled: true });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ devMode: true });
  });
});

describe('404 handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/nonexistent-route');
    expect(res.status).toBe(404);
  });
});
