import jwt from 'jsonwebtoken';
import InvariantError from '../errors/InvariantError.js';
import { nanoid } from 'nanoid';

const TokenManager = {
  generateAccessToken: (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: parseInt(process.env.ACCESS_TOKEN_AGE) || '1800s',
    });
  },

  generateRefreshToken: (payload) => {
    const uniquePayload = {
      ...payload,
      jti: nanoid(), 
    };
    return jwt.sign(uniquePayload, process.env.REFRESH_TOKEN_KEY);
  },

  verifyRefreshToken: (token) => {
    try {
      const payload = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

export default TokenManager;