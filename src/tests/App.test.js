import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import App from '../App';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('renders correctly', () => {
  const root = createRoot(container);
  act(() => {
    root.render(<App />);
  });
  expect(container.innerHTML).toMatchSnapshot();
});