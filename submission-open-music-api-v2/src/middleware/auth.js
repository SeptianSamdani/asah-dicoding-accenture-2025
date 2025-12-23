import jwt from 'jsonwebtoken';
import AuthenticationError from '../errors/AuthenticationError.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AuthenticationError('Missing authentication'));
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    req.auth = decoded;
    next();
  } catch (error) {
    next(new AuthenticationError('Token tidak valid'));
  }
};