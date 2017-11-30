import React from 'react'
import PropTypes from 'prop-types'
import './albumsStyles.css'

export default class ListOfFavoriteAlbumsComponent extends React.Component{
    constructor(props) {
        super(props)
        this.state = {}
        this.favThis = this.favThis.bind(this)
      }
      componentWillMount(){
        this.setState({favorites: JSON.parse(localStorage.getItem('favorites')) || [],
        favedAlbums: JSON.parse(localStorage.getItem('favedAlbums')) || []})
      }

      favThis = (event) =>{
          let {favorites, favedAlbums} = this.state
          let {albums} = this.props
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
                    albums[album].fav = true
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
        let {favedAlbums} = this.state
        let {albums} = this.props
        let filtered = albums? albums: favedAlbums
          return(
            <div className='container'>
                {filtered.map((album) => {
                return album.show? 
                  <li key={album.collectionId} 
                      id={album.collectionId} 
                      onClick={this.favThis} 
                      className={album.fav? 'card card-1 fav': 'card card-1'} 
                      style={{backgroundImage: 'url(' + album.artworkUrl100.replace('100x100', '600x600') + ')'}}>
                      <span onClick={this.favThis} > {album.collectionCensoredName} By {album.artistName} <br/> 
                      Total Tracks: {album.trackCount} <br/>
                      Genre: {album.primaryGenreName}</span>
                  </li>: null
            })}
            </div>
          )
      }
}

ListOfFavoriteAlbumsComponent.propTypes = {
  albums: PropTypes.array
}