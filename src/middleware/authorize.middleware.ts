import type { RequestHandler } from 'express';
import type { Role } from '../models/user.model.js';
import { AppError } from '../utils/app-error.js';

export function authorize(...allowedRoles: Role[]): RequestHandler {
  return (request, response, next) => {
    // STUDENT TODO 03
    // Goal: allow only authenticated users whose role is accepted by this route.
    // Steps: inspect request.auth, check whether its role is in allowedRoles,
    // return 403 when it is not allowed, and otherwise call next().
    // Hint: authenticate should run first and populate request.auth.
    void request;
    void response;
    void next;
    void allowedRoles;
    throw new AppError(501, 'STUDENT_TODO', 'Complete TODO 03: authorize');
  };
}
