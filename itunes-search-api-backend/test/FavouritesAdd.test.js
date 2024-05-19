const request = require('supertest');
const app = require('../server.js'); // Assuming your server.js exports the Express app

test('POST /api/favourites adds an item to favorites', async () => {
  const newItem = { id: 1, trackName: 'Sample Track' };
  const response = await request(app)
    .post('/api/favourites')
    .send(newItem);

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual(newItem);

});
