import Joi from 'joi';

export const playlistSchema = Joi.object({
  name: Joi.string().required(),
});

export const playlistSongSchema = Joi.object({
  songId: Joi.string().required(),
});