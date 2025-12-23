import express from 'express';
import UsersService from '../services/usersService.js';
import AuthenticationsService from '../services/authenticationsService.js';
import TokenManager from '../utils/tokenManager.js';
import {
  postAuthenticationSchema,
  putAuthenticationSchema,
  deleteAuthenticationSchema,
} from '../validators/authenticationsValidator.js';
import InvariantError from '../errors/InvariantError.js';

const router = express.Router();
const usersService = new UsersService();
const authenticationsService = new AuthenticationsService();

// LOGIN
router.post('/', async (req, res, next) => {
  try {
    const { error } = postAuthenticationSchema.validate(req.body);
    if (error) {
      throw new InvariantError(error.message);
    }

    const { username, password } = req.body;
    const userId = await usersService.verifyUserCredential(username, password);

    const accessToken = TokenManager.generateAccessToken({ userId });
    const refreshToken = TokenManager.generateRefreshToken({ userId });

    await authenticationsService.addRefreshToken(refreshToken);

    res.status(201).json({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (e) {
    next(e);
  }
});

// REFRESH TOKEN
router.put('/', async (req, res, next) => {
  try {
    const { error } = putAuthenticationSchema.validate(req.body);
    if (error) {
      throw new InvariantError(error.message);
    }

    const { refreshToken } = req.body;

    await authenticationsService.verifyRefreshToken(refreshToken);
    const { userId } = TokenManager.verifyRefreshToken(refreshToken);

    const accessToken = TokenManager.generateAccessToken({ userId });

    res.json({
      status: 'success',
      data: { accessToken },
    });
  } catch (e) {
    next(e);
  }
});

// LOGOUT
router.delete('/', async (req, res, next) => {
  try {
    const { error } = deleteAuthenticationSchema.validate(req.body);
    if (error) {
      throw new InvariantError(error.message);
    }

    const { refreshToken } = req.body;
    await authenticationsService.deleteRefreshToken(refreshToken);

    res.json({
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    });
  } catch (e) {
    next(e);
  }
});

export default router;