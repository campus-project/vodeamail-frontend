import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from '../pages/NotFound';

test('renders not found message', () => {
  render(<NotFound />);
  const linkElement = screen.getByText(/not found/i);
  expect(linkElement).toBeInTheDocument();
});
