import request from 'supertest';
import app from '../server.js';

describe('API Tests', () => {
  let server;
  beforeAll(() => {
    server = app.listen(8080);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should search iTunes items', async () => {
    const res = await request(app)
      .get('/api/search')
      .query({ searchTerm: 'test', mediaType: 'music' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should add item to favorites', async () => {
    const newItem = { id: 1, trackName: 'Test Track' };
    const res = await request(app).post('/api/favourites').send(newItem);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(newItem);
  });

  it('should get favorites', async () => {
    const res = await request(app).get('/api/favourites');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should delete item from favorites', async () => {
    const newItem = { id: 1, trackName: 'Test Track' };
    
    // Add the item first
    await request(app).post('/api/favourites').send(newItem);

    // Check if item exists in favorites
    const favoritesRes = await request(app).get('/api/favourites');
    console.log('Favorites before delete:', favoritesRes.body); // Add this line

    // Then delete the item
    const res = await request(app).delete(`/api/favourites/${newItem.id}`);

    console.log('Response from delete:', res.body); // Add this line

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Item removed from favorites');

    // Check if item is removed from favorites
    const updatedFavoritesRes = await request(app).get('/api/favourites');
    console.log('Favorites after delete:', updatedFavoritesRes.body); // Add this line
  });
});
