//This code sets up an Express.js server with routes for searching iTunes items, managing a list of favorite items, 
//and handling CRUD (Create, Read, Update, Delete) operations on the favorites list. 
//It also incorporates middleware for security and CORS support. The server listens on a specified port and interacts with the 
//iTunes Search API and a simulated favorites array.

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use(helmet());

const ITUNES_API_URL = 'https://itunes.apple.com/search';

app.get('/api/search', async (req, res) => {
  const { searchTerm, mediaType, callback } = req.query;

  try {
    const response = await fetch(
      `${ITUNES_API_URL}?term=${searchTerm}&media=${mediaType}`
    );

    if (!response.ok) {
      console.error(`iTunes API request failed with status: ${response.status}`);
      return res.status(500).json({ message: 'Failed to fetch from iTunes API' });
    }

    const data = await response.json();

    if (callback) {
      res.send(`${callback}(${JSON.stringify(data)})`);
    } else {
      res.json(data.results);
    }
  } catch (error) {
    console.error('Error fetching from iTunes API:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

let favorites = [];

app.get('/api/favourites', (req, res) => {
  res.json(favorites);
});

app.post('/api/favourites', (req, res) => {
  const newItem = req.body;

  const exists = favorites.find((item) => item.id === newItem.id);

  if (!exists) {
    favorites.push(newItem);
    res.json(newItem);
  } else {
    res.status(400).json({ message: 'Item already in favorites' });
  }
});

app.delete('/api/favourites/:id', (req, res) => {
  const itemId = req.params.id;

  const index = favorites.findIndex((item) => item.id == itemId);

  if (index !== -1) {
    favorites.splice(index, 1);
    res.json({ message: 'Item removed from favorites' });
  } else {
    console.error('Favorites:', favorites); // Debugging information
    res.status(404).json({ message: 'Item not found in favorites' });
  }
});

if (process.argv[1] === new URL(import.meta.url).pathname) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
