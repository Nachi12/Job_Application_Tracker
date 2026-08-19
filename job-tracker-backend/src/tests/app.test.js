import request from 'supertest';
import { createApp } from '../app.js';

describe('App Root and Health Endpoints', () => {
  const app = createApp();

  test('GET / should return 200 OK with status and message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: 'ok',
      message: 'Job Application Tracker API'
    });
  });

  test('GET /health should return 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('GET /unknown-route should return 404', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Not found - /unknown-route');
  });
});
