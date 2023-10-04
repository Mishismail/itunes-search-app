import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';

function Favourites({ favorites, handleRemoveFromFavorites }) {

  return (
    <div>
      <h2>Favourites</h2>
      <ListGroup>
        {favorites.map((favorite) => (
          <ListGroup.Item key={favorite.trackId} className="searched-item"> 
            {favorite.trackName}
            <Button
              variant="outline-danger"
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



