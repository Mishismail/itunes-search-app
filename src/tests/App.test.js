import React from 'react';
import renderer from 'react-test-renderer';
import Search from '../App.js';

test('Search component renders correctly', () => {
  const tree = renderer.create(<Search />).toJSON();
  expect(tree).toMatchSnapshot();
});



