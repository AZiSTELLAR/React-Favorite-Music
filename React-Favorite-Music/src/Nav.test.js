import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // NavLink needs a Router context
import Nav from './Nav';

describe('Nav Component', () => {
  test('renders without crashing', () => {
    render(
      <Router>
        <Nav />
      </Router>
    );
  });

  test('renders Search and Favorite Albums links', () => {
    render(
      <Router>
        <Nav />
      </Router>
    );
    expect(screen.getByText(/Search/i)).toBeInTheDocument();
    expect(screen.getByText(/Favorite Albums/i)).toBeInTheDocument();
  });
});
