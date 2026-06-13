function validateEnv() {
  const required = ['MONGO_URI'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    console.warn(`Warning: Missing environment variables: ${missing.join(', ')}`);
    console.warn('The server will attempt to use in-memory MongoDB as fallback.');
  }

  const port = parseInt(process.env.PORT, 10);
  if (process.env.PORT && (isNaN(port) || port < 1 || port > 65535)) {
    throw new Error(`Invalid PORT: ${process.env.PORT}. Must be between 1 and 65535.`);
  }
}

module.exports = { validateEnv };
