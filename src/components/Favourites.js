//This code is a React functional component. It receives an array of favorite items (favorites) and a function (handleRemoveFromFavorites) as props. 
//The component renders a list of favorite items with a "Remove" button next to each item, allowing users to remove items from their favorites list.

import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';

function Favourites({ favorites, handleRemoveFromFavorites }) {
  // This component receives an array of 'favorites' and a function 'handleRemoveFromFavorites' as props.

  return (
    <div>
      <h2>Favourites</h2>
      {/* Display a heading for the favorites section */}
      <ListGroup>
        {/* Render a ListGroup component to display the list of favorite items */}
        {favorites.map((favorite) => (
          // Map through the 'favorites' array and create a ListGroup.Item for each favorite
          <ListGroup.Item key={favorite.trackId} className="searched-item">
            {/* Display the name of the favorite item */}
            {favorite.trackName}
            <Button
              variant="outline-danger"
              size="sm"
              className="ml-2"
              onClick={() => handleRemoveFromFavorites(favorite)}
            >
              Remove
            </Button>
            {/* Display a 'Remove' button for each favorite item */}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default Favourites;




