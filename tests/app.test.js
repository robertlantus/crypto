
// app.test.js
// Testing using Jest

import request from 'supertest';

// Import the app without starting the server
import { app } from '../server.js';

describe('GET /api/coins/markets', () => {

    it('should return 200 and all cached market data', async () => {

        const response = await request(app).get('/api/coins/markets');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

//     it('should return 404 if no market data is found', async () => {
//         // Simulate Redis being empty or no data found
//         const response = await request(app).get('/api/coins/markets');

//         expect(response.status).toBe(404);
//         expect(response.body.message).toBe('No cached market data in Redis cache');
//     });
});


describe('GET /api/coins/markets/:ids', () => {

    it('should return 200 and market data for provided ids', async () => {

        const response = await request(app).get('/api/coins/markets/bitcoin,ethereum');

        expect(response.statusCode).toBe(200);  // OK
        expect(Array.isArray(response.body)).toBe(true);   
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return 400 if invalid coin ids are provided', async () => {

        const response = await request(app).get('/api/coins/markets/invalidcoin');

        expect(response.statusCode).toBe(400);  // Bad request
        expect(response.body).toHaveProperty('message', 'No data found for the provided coin ids: invalidcoin');
    });

    // it('should return 500 if there is a server error', async () => {

    //     const response = await request(app).get('/api/coins/markets/bitcoin');

    //     expect(response.statusCode).toBe(500);  // Internal Server Error
    //     expect(response.body).toHaveProperty('message', 'Error retrieving coin market data');
    // });
});





