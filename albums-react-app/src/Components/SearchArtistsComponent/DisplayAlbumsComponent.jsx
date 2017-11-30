import React from 'react'
import PropTypes from 'prop-types'
import '../albumsStyles.css'

export default class DisplayAlbumsComponent extends React.Component{
    constructor(props) {
        super(props)
        this.state = {}
      }
      componentWillMount(){
        this.setState({favorites: JSON.parse(localStorage.getItem('favorites')) || []})
      }
      render = () =>{
          let {albums} = this.props
          let {favorites} = this.state
          return(<div className='container'>
              {albums.map((album) =>{
                return <li key={album.collectionId} 
                            id={album.collectionId} 
                            onClick={this.props.favorite} 
                            className={favorites.includes(album.collectionId)? 'card card-1 fav' :'card card-1 '} 
                            style={{backgroundImage: 'url(' + album.artworkUrl100.replace('100x100', '600x600') + ')'}}>
                            <span onClick={this.props.favorite} > {album.collectionCensoredName} By {album.artistName} <br/> 
                            Total Tracks: {album.trackCount} <br/>
                            Genre: {album.primaryGenreName}</span>
                        </li>
            })
          }</div>)
      }
}

DisplayAlbumsComponent.propTypes = {
    albums: PropTypes.array.isRequired,
    favorite: PropTypes.func
}