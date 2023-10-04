const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

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
    const data = await response.json();

    if (callback) {
      // Wrap the JSON data in the callback function
      res.send(`${callback}(${JSON.stringify(data)})`);
    } else {
      res.json(data.results);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Array to simulate a database of favorites
let favorites = [];

app.get('/api/favourites', (req, res) => {
  res.json(favorites);
});

app.post('/api/favourites', (req, res) => {
  const newItem = req.body;

  // Check if the item already exists in favorites
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

  // Find the index of the item to be removed
  const index = favorites.findIndex((item) => item.id === itemId);

  if (index !== -1) {
    favorites.splice(index, 1);
    res.json({ message: 'Item removed from favorites' });
  } else {
    res.status(404).json({ message: 'Item not found in favorites' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

