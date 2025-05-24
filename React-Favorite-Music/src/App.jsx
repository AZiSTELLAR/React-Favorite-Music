import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'; // Import Routes and useLocation
import Nav from './Nav';
import SearchArtistsComponent from './Components/SearchArtistsComponent';
import FilterFavoritesComponent from './Components/FilterFavoritesComponent';
import './App.css';

/**
 * Component to display when no route matches the current URL.
 * It uses the `useLocation` hook to display the path that was not found.
 * @returns {JSX.Element} A div element containing a "no match" message.
 */
const NoMatch = () => {
  let location = useLocation();
  return (
    <div>
      <h3>No match for <code>{location.pathname}</code></h3>
    </div>
  );
};

/**
 * Main application component.
 * Sets up the main routing for the application using React Router.
 * Includes a header with navigation and defines routes for searching artists
 * and viewing favorite albums.
 * @constructor
 * @extends {Component}
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Router>
        <div className='App'>
          <header className='App-header'>
            <Nav />
          </header>
          <Routes> {/* Replace Switch with Routes */}
            <Route path='/' element={<SearchArtistsComponent />} /> {/* Use element prop and remove exact */}
            <Route path='/favorites' element={<FilterFavoritesComponent />} /> {/* Use element prop */}
            <Route path="*" element={<NoMatch />} /> {/* Update NoMatch route */}
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
