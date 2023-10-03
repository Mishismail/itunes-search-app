import React, { useState } from 'react';
import { ListGroup, Button, Alert } from 'react-bootstrap';

function Favourites({ favorites, handleRemoveFromFavorites }) {
  // Initialize showAlert state
  const [showAlert, setShowAlert] = useState(false);

  return (
    <div>
      <h2>Favourites</h2>
  
      {/* Display the alert when showAlert is true */}
      {showAlert && (
        <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
          Item removed from favorites!
        </Alert>
      )}
  
      <ListGroup>
        {favorites.map((favorite) => (
          <ListGroup.Item key={favorite.trackId}>
            {favorite.trackName}
            <Button
              variant="danger"
              size="sm"
              className="ml-2"
              onClick={() => handleRemoveFromFavorites(favorite)}
            >
              Remove
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default Favourites;



