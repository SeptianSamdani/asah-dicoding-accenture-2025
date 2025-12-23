import Joi from 'joi';

export const userSchema = Joi.object({
  username: Joi.string().max(50).required(),
  password: Joi.string().required(),
  fullname: Joi.string().max(100).required(),
});