import request from 'supertest';
import app from '../app';
import pool from '../db';

describe('Users endpoints', () => {
  describe('POST /users', () => {
    it('should return new user for a valid request', async () => {
      // Arrange
      const data = {
        firstName: 'Gadi',
        lastName: 'Raymond',
        email: 'gadi@wix.com',
      };
      // Act
      const res = await request(app)
        .post('/api/v1/users')
        .send(data)
        .expect(200);
      // Assert
      expect(res.body.firstName).toBe(data.firstName);
      expect(res.body.lastName).toBe(data.lastName);
      expect(res.body.email).toBe(data.email);
      expect(res.body.id).toBeGreaterThan(0);
      expect(res.body.bitcoins).toBeGreaterThanOrEqual(0);
      expect(res.body.bitcoins).toBeLessThanOrEqual(10);
    });
    it('should return bad request when missing required firstName in the request', async () => {
      // Arrange
      const data = { lastName: 'Raymond', email: 'gadi@wix.com' };
      // Act + Assert
      await request(app).post('/api/v1/users').send(data).expect(400);
    });
    it('should return bad request when email is not valid in the request', async () => {
      // Arrange
      const data = {
        firstName: 'Gadi',
        lastName: 'Raymond',
        email: 'gadi-wix.com',
      };
      // Act + Assert
      await request(app).post('/api/v1/users').send(data).expect(400);
    });
    it('should return internal server error when pg throws an error', async () => {
      // Arrange
      const data = {
        firstName: 'Gadi',
        lastName: 'Raymond',
        email: 'gadi@wix.com',
      };
      const connect = pool.connect;
      const query = pool.query;
      pool.connect = jest.fn();
      pool.query = jest.fn().mockRejectedValue(new Error('db error'));

      // Act + Assert
      await request(app).post('/api/v1/users').send(data).expect(500);
      pool.connect = connect;
      pool.query = query;
    });
  });
  describe('GET /users/:userId', () => {
    it('should return the same user we insert', async () => {
      // Arrange
      const data = {
        firstName: 'Gadi',
        lastName: 'Raymond',
        email: 'gadi@wix.com',
      };
      const postRes = await request(app)
        .post('/api/v1/users')
        .send(data)
        .expect(200);

      // Act
      const getRes = await request(app)
        .get(`/api/v1/users/${postRes.body.id}`)
        .expect(200);
      // Assert
      expect(getRes.body).toStrictEqual(postRes.body);
    });
    it('should return bad request when userId is not a number', async () => {
      // Arrange
      const invalidUserId = 'some-user-id';
      // Act + Assert
      await request(app).get(`/api/v1/users/${invalidUserId}`).expect(400);
    });
    it('should return 404 when user is not found', async () => {
      // Arrange
      const notFoundUserId = 99999;
      // Act + Assert
      await request(app).get(`/api/v1/users/${notFoundUserId}`).expect(404);
    });
    it('should return internal server error when pg throws an error', async () => {
      // Arrange
      const notFoundUserId = 99999;
      const connect = pool.connect;
      const query = pool.query;
      pool.connect = jest.fn();
      pool.query = jest.fn().mockRejectedValue(new Error('db error'));
      // Act + Assert
      await request(app).get(`/api/v1/users/${notFoundUserId}`).expect(500);
      pool.connect = connect;
      pool.query = query;
    });
  });
});
