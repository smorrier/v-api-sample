import request from 'supertest';
import app, { server } from './src/app';

afterAll((done) => {
	server.close(done);
});

describe('GET /get-word', () => {
	it('should return example usage for a verb', async () => {
		const res = await request(app).get('/get-word?word=run');
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('exampleUsage');
	});

	it('should return dictionary definition for a non-verb', async () => {
		const res = await request(app).get('/get-word?word=apple');
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('definition');
	});

	it('should handle invalid word', async () => {
		const res = await request(app).get('/get-word?word=invalidword');
		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty('error');
	});

	it('should return an error when word is not provided', async () => {
		const res = await request(app).get('/get-word?word=');
		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty('error');
	});
});

describe('POST /number-to-word', () => {
	it('should return word for a valid input', async () => {
		const res = await request(app).post('/number-to-word').send({ num: 3 });
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('word', 'three');
	});

	it('should handle invalid input', async () => {
		const res = await request(app).post('/number-to-word').send({ num: 10 });
		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty('error');
	});

	it('should return an error when num is not provided', async () => {
		const res = await request(app).post('/number-to-word').send({});
		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty('error');
	});
});

describe('GET /who-made-me', () => {
	it('should return creator and fun fact', async () => {
		const res = await request(app).get('/who-made-me');
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('creator');
		expect(res.body).toHaveProperty('funFact');
	});
});