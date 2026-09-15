import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../src/app.js';
import { User } from '../src/models/user.model.js';
import { Session } from '../src/models/session.model.js';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

beforeEach(async () => {
  await User.deleteMany({});
  await Session.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

test('register creates a USER, stores a hash, and starts a session', async () => {
  const response = await request(app).post('/api/auth/register').send({ email: 'student@example.com', password: 'StrongPass123!' }).expect(201);
  expect(response.body.user).toEqual(expect.objectContaining({ email: 'student@example.com', role: 'USER' }));
  expect(response.headers['set-cookie']).toHaveLength(2);
  const user = await User.findOne({ email: 'student@example.com' }).lean();
  expect(user?.passwordHash).not.toBe('StrongPass123!');
  expect(await Session.countDocuments({ userId: user?._id })).toBe(1);
});

test('register rejects a duplicate email', async () => {
  await request(app).post('/api/auth/register').send({ email: 'student@example.com', password: 'StrongPass123!' }).expect(201);
  const response = await request(app).post('/api/auth/register').send({ email: 'student@example.com', password: 'StrongPass123!' }).expect(409);
  expect(response.body.error.code).toBe('EMAIL_ALREADY_EXISTS');
});
