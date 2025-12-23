import express from 'express';
import UsersService from '../services/usersService.js';
import { userSchema } from '../validators/usersValidator.js';
import InvariantError from '../errors/InvariantError.js';

const router = express.Router();
const usersService = new UsersService();

router.post('/', async (req, res, next) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) {
      throw new InvariantError(error.message);
    }

    const userId = await usersService.addUser(req.body);
    res.status(201).json({
      status: 'success',
      data: { userId },
    });
  } catch (e) {
    next(e);
  }
});

export default router;