import React from 'react'
import SearchInputComponent from '../SearchInputComponent'
import DisplayAlbumsComponent from './DisplayAlbumsComponent'
import axios from 'axios'

export default class SearchArtistsComponent extends React.Component{
    constructor(props) {
        super(props)
        this.state = {}
        this.searchItunes = this.searchItunes.bind(this)        
      }

      componentWillMount(){
        this.setState({favorites: JSON.parse(localStorage.getItem('favorites')) || [],
        favedAlbums: JSON.parse(localStorage.getItem('favedAlbums')) || []
      })
      }

      searchItunes = (artist) =>{
        axios.get('https://itunes.apple.com/search', {
          params: {
            term: artist,
            entity: 'album'
          }
        })
        .then((response) => {
          this.setState({albums: response.data.results})
        }).catch((error) => {
          this.setState({errorMessage: error.response})
        })
      }

      favThis = (event) =>{
        let {favorites, albums, favedAlbums} = this.state
        let id = event.target.id,
          item = event.target,
          index = favorites.indexOf(id)
          if (!id) return;
          // item is not favorite
          if (index === -1) {
            favorites.push(id)
            for (const album in albums) {
              if (albums[album].collectionId.toString() === id
                && !favedAlbums.includes(albums[album])) {
                  albums[album].show = true
                favedAlbums.push(albums[album])
              }
            }
            item.classList.add('fav')
            // item is already favorite
          } else {
            favorites.splice(index, 1)
            favedAlbums.splice(index, 1)
            item.classList.remove('fav')
          }
          // store array in local storage
          localStorage.setItem('favorites', JSON.stringify(favorites))
          localStorage.setItem('favedAlbums', JSON.stringify(favedAlbums))
    } 

      render = () =>{
          let {albums} = this.state
          return(
              <div>
                  <SearchInputComponent onSearchChange={this.searchItunes}/>
                  {albums? <DisplayAlbumsComponent albums={this.state.albums} favorite={this.favThis}/>:null}
              </div>
          )
      }
}