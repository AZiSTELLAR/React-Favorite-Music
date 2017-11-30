import React from 'react'
import SearchInputComponent from '../SearchInputComponent'
import ListOfFavoriteAlbumsComponent from './ListOfFavoriteAlbumsComponent'
import '../albumsStyles.css'

export default class FilterFavoritesComponent extends React.Component{
    constructor(props) {
        super(props)
        this.state = {}
        this.searchFaves = this.searchFaves.bind(this)
      }

componentWillMount(){
    this.setState({favedAlbums: JSON.parse(localStorage.getItem('favedAlbums')) || []})
  }

  searchFaves = (artist) => {
      let {favedAlbums} = this.state
      for (const key in favedAlbums) {
          if (favedAlbums[key].artistName.toUpperCase().indexOf(artist.toUpperCase())) {
              favedAlbums[key].show = false
          }else{
            favedAlbums[key].show = true
            favedAlbums[key].fav = true
          }
      }
      this.setState({favedAlbums})
  }

  render = () =>{
      return(
          <div>
            <SearchInputComponent onSearchChange={this.searchFaves}/>
            <ListOfFavoriteAlbumsComponent albums={this.state.favedAlbums}/>
          </div>
      )
  }


}