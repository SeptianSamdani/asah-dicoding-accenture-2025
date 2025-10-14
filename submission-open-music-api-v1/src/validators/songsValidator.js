import Joi from 'joi';


export const songSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().required(),
    performer: Joi.string().required(),
    genre: Joi.string().required(),
    duration: Joi.number().optional(),
    albumId: Joi.string().optional().allow(null),
});