import Joi from 'joi';

export const postAuthenticationSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const putAuthenticationSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export const deleteAuthenticationSchema = Joi.object({
  refreshToken: Joi.string().required(),
});