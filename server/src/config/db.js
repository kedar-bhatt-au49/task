const mongoose = require('mongoose');

const connectDB = async () => {
  let uri = process.env.MONGO_URI || 'mongodb://localhost:27017/vocab-builder';

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.log(`Local MongoDB not available (${error.message})`);
    console.log('Starting in-memory MongoDB...');

    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB (in-memory) Connected: ${conn.connection.host}`);
    return conn;
  }
};

module.exports = connectDB;
