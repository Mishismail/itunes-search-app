//This code sets up an Express.js server with routes for searching iTunes items, managing a list of favorite items, 
//and handling CRUD (Create, Read, Update, Delete) operations on the favorites list. 
//It also incorporates middleware for security and CORS support. The server listens on a specified port and interacts with the 
//iTunes Search API and a simulated favorites array.


const express = require('express');
const helmet = require('helmet'); // Middleware for enhancing security
const cors = require('cors'); // Middleware for enabling Cross-Origin Resource Sharing
const fetch = require('node-fetch'); // Library for making HTTP requests

const app = express(); // Create an Express application
const PORT = process.env.PORT || 3000; // Define the port for the server

app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS for cross-origin requests
app.use(helmet()); // Enhance security by setting various HTTP headers

const ITUNES_API_URL = 'https://itunes.apple.com/search'; // URL for the iTunes Search API

// Define a route for searching iTunes items
app.get('/api/search', async (req, res) => {
  const { searchTerm, mediaType, callback } = req.query;

  try {
    // Make a request to the iTunes Search API with provided parameters
    const response = await fetch(
      `${ITUNES_API_URL}?term=${searchTerm}&media=${mediaType}`
    );
    const data = await response.json();

    if (callback) {
      // If a callback is provided, wrap the JSON data in the callback function
      res.send(`${callback}(${JSON.stringify(data)})`);
    } else {
      // If no callback, send the JSON data directly
      res.json(data.results);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Array to simulate a database of favorite items
let favorites = [];

// Define a route for getting the list of favorite items
app.get('/api/favourites', (req, res) => {
  res.json(favorites);
});

// Define a route for adding an item to favorites
app.post('/api/favourites', (req, res) => {
  const newItem = req.body;

  // Check if the item already exists in favorites
  const exists = favorites.find((item) => item.id === newItem.id);

  if (!exists) {
    // If the item doesn't exist, add it to the favorites array
    favorites.push(newItem);
    res.json(newItem);
  } else {
    // If the item already exists, return an error message
    res.status(400).json({ message: 'Item already in favorites' });
  }
});

// Define a route for removing an item from favorites
app.delete('/api/favourites/:id', (req, res) => {
  const itemId = req.params.id;

  // Find the index of the item to be removed
  const index = favorites.findIndex((item) => item.id === itemId);

  if (index !== -1) {
    // If the item exists, remove it from the favorites array
    favorites.splice(index, 1);
    res.json({ message: 'Item removed from favorites' });
  } else {
    // If the item doesn't exist, return an error message
    res.status(404).json({ message: 'Item not found in favorites' });
  }
});

// Start the Express server on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


