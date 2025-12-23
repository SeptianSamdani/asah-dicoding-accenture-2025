// src/errors/InvariantError.js
import ClientError from './ClientError.js';

export default class InvariantError extends ClientError {
  constructor(message = 'Bad request') {
    super(message, 400);
    this.name = 'InvariantError';
  }
}