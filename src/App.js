import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Spinner, ListGroup, Tab, Tabs, Alert } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs'; // Import a search icon
import './App.css'; // Import your custom CSS styling here
import appleLogo from './images/apple-logo.png';
import Favourites from './components/Favourites.js'

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaType, setMediaType] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [favorites, setFavorites] = useState([]);
  const [showAlert, setShowAlert] = useState(false); // Declare and initialize showAlert
  const [showAddAlert, setShowAddAlert] = useState(false);


  const handleSearch = () => {
    setLoading(true);
  
    // Generate a random callback function name to avoid conflicts
    const callbackName = `itunesSearchCallback_${Date.now()}`;
    const itunesApiUrl = `https://itunes.apple.com/search?term=${searchTerm}&media=${mediaType}&callback=${callbackName}`;
  
    // Create a script element for JSONP
    const script = document.createElement('script');
    script.src = itunesApiUrl;
  
    // Define the callback function to handle the JSONP response
    window[callbackName] = (data) => {
      if (data && data.results) {
        setSearchResults(data.results);
      } else {
        // Handle the case where the response is not as expected
        console.error('Invalid JSONP response:', data);
        // You can display an error message to the user here
      }
  
      setLoading(false);
  
      // Clean up by removing the script tag and callback function
      document.body.removeChild(script);
      delete window[callbackName];
    };
  
    // Error handling for script load errors
    script.onerror = (error) => {
      console.error('Error loading JSONP script:', error);
      setLoading(false);
      // You can display an error message to the user here
    };
  
    // Append the script tag to the document to initiate the JSONP request
    document.body.appendChild(script);
  };
  
  

  const addToFavorites = async (item) => {
    try {
      // Make a POST request to add the item to favorites
      const response = await fetch('/api/favourites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      const data = await response.json();
      setFavorites([...favorites, data]);

      // Show the alert
      setShowAddAlert(true);

      // Hide the alert after a few seconds
      setTimeout(() => {
        setShowAddAlert(false);
      }, 3000); // You can adjust the duration as needed
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToFavorites = (item) => {
    addToFavorites(item);
    setFavorites([...favorites, item]);
  
    // Show the alert
    setShowAddAlert(true);
  
    // Hide the alert after a few seconds
    setTimeout(() => {
      setShowAddAlert(false);
    }, 10000); // You can adjust the duration as needed
  };
  

  const handleRemoveFromFavorites = async (itemToRemove) => {
    try {
      // Make a DELETE request to remove the item from favorites
      await fetch(`/api/favourites/${itemToRemove.id}`, {
        method: 'DELETE',
      });
  
      // Update favorites state by removing only the selected item
      const updatedFavorites = favorites.filter((item) => item.id !== itemToRemove.id);
      setFavorites(updatedFavorites);
  
      // Show the alert
      setShowAlert(true);
  
      // Hide the alert after a few seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 3000); // You can adjust the duration as needed
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Fetch user's favorite content from the server and update the state
    fetch('/api/favourites')
      .then((response) => response.json())
      .then((data) => setFavorites(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const background = document.querySelector('.background');
    const colors = [
      ['#ff5f6d', '#ffc371'],
      ['#6A11CB', '#2575FC'],
      ['#FC5C7D', '#6A82FB'],
      // Add more color combinations here
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    const [color1, color2] = colors[randomIndex];
    background.style.background = `linear-gradient(to bottom right, ${color1}, ${color2})`;
  }, []);

  return (
    <div className="background">
      <Container>
        {/* Display the alert when showAddAlert is true */}
        {showAddAlert && (
        <Alert variant="success" onClose={() => setShowAddAlert(false)} dismissible>
        Item added to favorites!
        </Alert>
        )}
        {/* Display the alert when showAlert is true */}
      {showAlert && (
        <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
          Item removed from favorites!
        </Alert>
      )}
        <div className="search-container">
        <div className="header-content">
           <img
            src={appleLogo}
            alt="Apple Logo"
            className="apple-logo img-fluid" // Add img-fluid for responsive design
            style={{ maxWidth: '100px' }} // Set a max width to control the size
        />
        <h1 className="search-header" style={{ fontSize: '70px', fontWeight: 'bold' }}>
        <b>iTunes Search</b>
        </h1>
        </div>
         <div className="search-content">
            <Tabs
              activeKey={activeTab}
              onSelect={(key) => setActiveTab(key)}
              className="rounded-tabs"
            >
              <Tab eventKey="search" title="Search">
                <Form className="search-form">
                  <Form.Group className="search-input">
                    <Form.Control
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <BsSearch className="search-icon" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Control
                      as="select"
                      value={mediaType}
                      onChange={(e) => setMediaType(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="movie">Movie</option>
                      <option value="podcast">Podcast</option>
                      <option value="music">Music</option>
                      <option value="audiobook">Audiobook</option>
                      <option value="shortFilm">Short Film</option>
                      <option value="tvShow">TV Show</option>
                      <option value="software">Software</option>
                      <option value="ebook">Ebook</option>
                    </Form.Control>
                  </Form.Group>
                  <div className="mb-3"></div>
                  <Button variant="primary" onClick={handleSearch}>
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" />
                        {' Searching...'}
                      </>
                    ) : (
                      'Search'
                    )}
                  </Button>
                </Form>
                <div className="mt-4">
                  {searchResults.length > 0 ? (
                    <ListGroup>
                      {searchResults.map((result) => (
                        <ListGroup.Item key={result.trackId}>
                          {result.trackName}
                    <Button
                        variant="success"
                        size="sm"
                        className="ml-2"
                        onClick={() => handleAddToFavorites(result)}
                      >
                        Add to Favorites
                    </Button>
                     </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <p>Results</p>
                  )}
                </div>
              </Tab>
              <Tab eventKey="favourite" title="Favourites">
                <Favourites
                  addToFavorites={handleAddToFavorites}
                  removeFromFavorites={handleRemoveFromFavorites}
                  favorites={favorites}
                  handleRemoveFromFavorites={handleRemoveFromFavorites} // Pass the function here
                  />
             </Tab>
            </Tabs>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Search;



