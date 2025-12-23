import Joi from 'joi';

export const albumSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});
