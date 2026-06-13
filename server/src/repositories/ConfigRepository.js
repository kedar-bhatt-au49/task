const Config = require('../models/Config');

class ConfigRepository {
  async get(key) {
    const doc = await Config.findOne({ key }).lean();
    return doc ? doc.value : null;
  }

  async set(key, value) {
    return Config.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true, new: true, lean: true }
    );
  }
}

module.exports = new ConfigRepository();
