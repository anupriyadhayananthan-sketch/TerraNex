import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../server/app.js';

describe('server/routes.test.js — Express API Backend Layer Suite', () => {
  it('GET /api/projects returns 200 and array of 52 projects', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(res.body.projects).toBeDefined();
    expect(res.body.projects.length).toBe(52);
  });

  it('GET /api/projects/:id returns 200 and project object for PRJ-001', async () => {
    const res = await request(app).get('/api/projects/PRJ-001');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('PRJ-001');
    expect(res.body.name).toBe('Patna-West Peripheral Ring Road');
  });

  it('GET /api/projects/:id with invalid ID PRJ-999 returns 404', async () => {
    const res = await request(app).get('/api/projects/PRJ-999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Project not found');
  });

  it('GET /api/alerts returns 200 and high-risk projects list', async () => {
    const res = await request(app).get('/api/alerts');
    expect(res.status).toBe(200);
    expect(res.body.alerts).toBeDefined();
    expect(res.body.alerts.length).toBe(11);
  });

  it('POST /api/interventions with valid fields returns 201 confirmation', async () => {
    const res = await request(app)
      .post('/api/interventions')
      .send({
        project_id: 'PRJ-001',
        owner: 'District Collector',
        action: 'Review pending compensation cases'
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Intervention logged successfully');
    expect(res.body.intervention.project_id).toBe('PRJ-001');
  });

  it('POST /api/interventions with missing fields returns 400', async () => {
    const res = await request(app)
      .post('/api/interventions')
      .send({
        project_id: 'PRJ-001'
        // missing owner & action
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('GET /api/ingestion-feed returns 200 and 22 feed items', async () => {
    const res = await request(app).get('/api/ingestion-feed');
    expect(res.status).toBe(200);
    expect(res.body.feed).toBeDefined();
    expect(res.body.feed.length).toBe(22);
  });
});
