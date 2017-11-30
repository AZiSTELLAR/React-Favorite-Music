import React from 'react'
import SearchInputComponent from '../SearchInputComponent'
import ListOfFavoriteAlbumsComponent from '../FavoriteAlbumsComponent/ListOfFavoriteAlbumsComponent'
import axios from 'axios'

export default class SearchArtistsComponent extends React.Component{
    constructor(props) {
        super(props)
        this.state = {}
        this.searchItunes = this.searchItunes.bind(this)        
      }
      componentWillMount(){
        this.setState({favedAlbums: JSON.parse(localStorage.getItem('favedAlbums')) || []})
      }

      searchItunes = (artist) =>{
        let {favedAlbums} = this.state
        axios.get('https://itunes.apple.com/search', {
          params: {
            term: artist,
            entity: 'album'
          }
        })
        .then((response) => {
          let fetchedAlbums = response.data.results
          for (const key in fetchedAlbums) {
            fetchedAlbums[key].show = true
            for (const fav in favedAlbums) {
              if (fetchedAlbums[key].collectionId === favedAlbums[fav].collectionId) {
                fetchedAlbums[key].fav = true
              }
            }
          }
          this.setState({albums: fetchedAlbums})
        }).catch((error) => {
          this.setState({errorMessage: error.response})
        })
      }

      render = () =>{
          let {albums} = this.state
          return(
              <div>
                  <SearchInputComponent onSearchChange={this.searchItunes}/>
                  {albums? <ListOfFavoriteAlbumsComponent albums={albums}/>:null}
              </div>
          )
      }
}