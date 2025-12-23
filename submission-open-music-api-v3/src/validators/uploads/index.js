import InvariantError from '../../errors/InvariantError.js';
import { ImageHeadersSchema } from './schema.js';

export const validateImageHeaders = (headers) => {
  const { error } = ImageHeadersSchema.validate(headers);
  if (error) {
    throw new InvariantError(error.message);
  }
};