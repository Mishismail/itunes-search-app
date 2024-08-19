import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Favourites from '../Favourites';

const mockFavorites = [
  { trackId: 1, trackName: 'Track 1' },
  { trackId: 2, trackName: 'Track 2' },
];

const mockHandleRemoveFromFavorites = jest.fn();

describe('Favourites Component', () => {
  it('renders without crashing', () => {
    render(
      <Favourites
        favorites={mockFavorites}
        handleRemoveFromFavorites={mockHandleRemoveFromFavorites}
      />
    );

    expect(screen.getByText('Favourites')).toBeInTheDocument();
    expect(screen.getByText('Track 1')).toBeInTheDocument();
    expect(screen.getByText('Track 2')).toBeInTheDocument();
  });

  it('calls handleRemoveFromFavorites when Remove button is clicked', () => {
    render(
      <Favourites
        favorites={mockFavorites}
        handleRemoveFromFavorites={mockHandleRemoveFromFavorites}
      />
    );

    fireEvent.click(screen.getAllByText('Remove')[0]);
    expect(mockHandleRemoveFromFavorites).toHaveBeenCalledWith(mockFavorites[0]);

    fireEvent.click(screen.getAllByText('Remove')[1]);
    expect(mockHandleRemoveFromFavorites).toHaveBeenCalledWith(mockFavorites[1]);
  });
});