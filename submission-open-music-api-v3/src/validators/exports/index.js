import InvariantError from '../../errors/InvariantError.js';
import { ExportPlaylistPayloadSchema } from './schema.js';

export const validateExportPlaylistPayload = (payload) => {
  const { error } = ExportPlaylistPayloadSchema.validate(payload);
  if (error) {
    throw new InvariantError(error.message);
  }
};