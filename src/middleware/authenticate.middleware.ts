import type { RequestHandler } from 'express';
import { AppError } from '../utils/app-error.js';
import { verifyAccessToken } from '../utils/jwt.js';

export const authenticate: RequestHandler = (request, response, next) => {
  // STUDENT TODO 02
  // Goal: identify the user before a protected route reaches its controller.
  // Steps: read the accessToken cookie, return 401 if it is missing, verify it,
  // copy sub and role to request.auth, and call next(). Invalid or expired tokens
  // must also return 401.
  // Hint: verifyAccessToken() returns the payload needed for request.auth.
  void request;
  void response;
  void next;
  throw new AppError(501, 'STUDENT_TODO', 'Complete TODO 02: authenticate');
};
