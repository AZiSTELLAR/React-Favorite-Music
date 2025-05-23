import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'; // Import Routes and useLocation
import Nav from './Nav';
import SearchArtistsComponent from './Components/SearchArtistsComponent';
import FilterFavoritesComponent from './Components/FilterFavoritesComponent';
import './App.css';

// NoMatch component updated to use useLocation hook
const NoMatch = () => {
  let location = useLocation();
  return (
    <div>
      <h3>No match for <code>{location.pathname}</code></h3>
    </div>
  );
};

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
