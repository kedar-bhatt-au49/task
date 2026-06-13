class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

function errorHandler(err, req, res, _next) {
  if (err.name === 'ValidationError' && err.errors) {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(', ') });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ error: `Duplicate ${field}. This ${field} already exists.` });
  }

  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || (err.statusCode && err.statusCode < 500);
  const message = isOperational ? err.message : 'Internal server error';

  const response = { error: message };
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  console.error(`[${statusCode}] ${err.message}`);
  if (!err.isOperational) {
    console.error(err.stack);
  }

  res.status(statusCode).json(response);
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
}

module.exports = { AppError, errorHandler, notFoundHandler };
