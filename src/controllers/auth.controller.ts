import type { RequestHandler } from "express";
import { Types } from "mongoose";
import { Session } from "../models/session.model.js";
import { User, type Role } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies.js";
import {
  createAccessToken,
  createRefreshToken,
  refreshTokenExpiresAt,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { hashRefreshToken, refreshTokenMatches } from "../utils/token-hash.js";

type Credentials = { email?: unknown; password?: unknown };

// Leer y validar las credenciales del usuario (email y password) desde el cuerpo de la solicitud.
// Si las credenciales no son válidas, se lanza un error de validación.
function readCredentials(body: Credentials): {
  email: string;
  password: string;
} {
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  // Comprueba si el texto de la variable email no cumple con el patrón de la expresión regular.
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      "Provide a valid email and a password of at least 8 characters",
    );
  }

  return { email, password };
}

// Helper para devolver un objeto de usuario público que contiene solo los campos necesarios para la respuesta
// para no devolver todo el documento MongoDB y exponer información sensible como el hash de la contraseña.
function publicUser(user: { _id: Types.ObjectId; email: string; role: Role }) {
  return { id: user._id.toString(), email: user.email, role: user.role };
}

// Se crea un session id y un refresh token para el usuario autenticado,
// Se guarda la sesión en la base de datos y se devuelve un objeto con el access token y el refresh token.
async function createSessionTokens(
  user: { _id: Types.ObjectId; role: Role },
  userAgent?: string,
) {
  const sessionId = new Types.ObjectId();
  const userId = user._id.toString();
  const refreshToken = createRefreshToken(userId, sessionId.toString());

  // La sesion se guarda en MongoDB para que podamos invalidar el refresh token si el usuario cierra sesión
  // o si el refresh token se ve comprometido.
  await Session.create({
    _id: sessionId,
    userId: user._id,
    refreshTokenHash: hashRefreshToken(refreshToken),
    expiresAt: refreshTokenExpiresAt(),
    userAgent,
  });

  return { accessToken: createAccessToken(userId, user.role), refreshToken };
}

// Lee y valida si en MongoDB ya existe un usuario con el mismo email, si no existe,
// se crea un nuevo usuario con el email y la contraseña hasheada.
export const register: RequestHandler = async (request, response) => {
  const { email, password } = readCredentials(request.body);
  const existingUser = await User.exists({ email });
  if (existingUser)
    throw new AppError(409, "EMAIL_ALREADY_EXISTS", "Email already exists");

  // conveierte la password en un hash seguro antes de guardarla en la base de datos
  // MiPassword123 -> bcrypt -> $2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW
  const passwordHash = await hashPassword(password);
  // Crea un nuevo usuario en la base de datos con el email y el hash de la password
  const user = await User.create({ email, passwordHash, role: "USER" });
  // Crea un session id y un refresh token para el usuario autenticado
  const tokens = await createSessionTokens(user, request.get("user-agent"));
  // Envia el access token y el refresh token al cliente en cookies seguras
  setAuthCookies(response, tokens.accessToken, tokens.refreshToken);
  response.status(201).json({ user: publicUser(user) });
};

export const login: RequestHandler = async (request, response) => {
  // STUDENT TODO 01
  // Goal: sign in an existing user and start a persistent session.
  // Steps: read credentials, find the user, compare the password, reject invalid
  // credentials with 401 INVALID_CREDENTIALS, then create tokens and set cookies.
  // Hint: readCredentials(), comparePassword(), createSessionTokens(),
  // setAuthCookies(), and publicUser() are already available in this file.
  void request;
  void response;
  throw new AppError(501, "STUDENT_TODO", "Complete TODO 01: login");
};

export const refresh: RequestHandler = async (request, response, next) => {
  // STUDENT TODO 06
  // Goal: rotate a valid refresh token without allowing the previous token to be reused.
  // Steps: read and verify the cookie; load its Session using sid; validate its
  // owner, state, expiration, and hash; then load the User and rotate the token.
  // Save the new hash and expiration, set both cookies, and return publicUser(user).
  // Hint: verifyRefreshToken(), refreshTokenMatches(), hashRefreshToken(),
  // refreshTokenExpiresAt(), createRefreshToken(), and createAccessToken() help here.
  void request;
  void response;
  void next;
  throw new AppError(501, "STUDENT_TODO", "Complete TODO 06: refresh");
};

export const logout: RequestHandler = async (request, response, next) => {
  // STUDENT TODO 04
  // Goal: revoke only the session represented by the refresh-token cookie.
  // Steps: read and verify the refresh token, find its Session, validate the
  // owner and stored hash, mark it revoked, save it, clear cookies, and return 204.
  // Hint: verifyRefreshToken(), Session.findById(), refreshTokenMatches(), and
  // clearAuthCookies() cover the required operations.
  void request;
  void response;
  void next;
  throw new AppError(501, "STUDENT_TODO", "Complete TODO 04: logout");
};

export const logoutAll: RequestHandler = async (request, response) => {
  // STUDENT TODO 05
  // Goal: revoke every active session belonging to the authenticated user.
  // Steps: read request.auth.userId, use Session.updateMany() to revoke active
  // sessions, clear both auth cookies, and return 204.
  // Hint: authenticate runs before this controller, so request.auth is available.
  void request;
  void response;
  throw new AppError(501, "STUDENT_TODO", "Complete TODO 05: logout all");
};
