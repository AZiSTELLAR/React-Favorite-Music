import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Nav from './Nav'
import SearchArtistsComponent from './Components/SearchArtistsComponent/SearchArtistsComponent'
import FilterFavoritesComponent from './Components/FavoriteAlbumsComponent/FilterFavoritesComponent'
import './App.css'

const NoMatch = ({ location }) => (
  <div>
    <h3>No match for <code>{location.pathname}</code></h3>
  </div>
)
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  
  render() {
    return (
      <Router>
        <div className='App'>
          <header className='App-header'>
          <Nav/>
          </header>
          <Switch>
            <Route exact path='/' component={SearchArtistsComponent}/>
            <Route path='/favorites' component={FilterFavoritesComponent}/>
            <Route component={NoMatch}/>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;
