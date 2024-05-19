import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Search from '../App.js';

test('add to favorites function works correctly', () => {
  const { container } = render(<Search />);
  const itemToAdd = { trackId: 1, trackName: 'Sample Track' };

  // Simulate adding an item to favorites
  fireEvent.click(screen.getByText('Add to Favorites'));

  // Ensure that the item is added to favorites
  expect(container).toHaveTextContent('Sample Track');
});

