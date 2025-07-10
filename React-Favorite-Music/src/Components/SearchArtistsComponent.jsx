import React from 'react'
import SearchInputComponent from './SearchInputComponent'
import ListOfAlbumsComponent from './ListOfAlbumsComponent'
import axios from 'axios'

export default class SearchArtistsComponent extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
          loading: false, // Added loading state
          albums: null, // Initialize albums to null
          favedAlbums: []
        }
        this.searchItunes = this.searchItunes.bind(this)        
      }
      componentWillMount(){
        this.setState({favedAlbums: JSON.parse(localStorage.getItem('favedAlbums')) || []})
      }

      componentDidMount(){
        this.searchItunes('Daft Punk'); // Preload albums with a default artist
      }

      searchItunes = (artist) =>{
        this.setState({ loading: true }); // Set loading to true before API call
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
          this.setState({albums: fetchedAlbums, loading: false}) // Set loading to false on success
        }).catch((error) => {
          this.setState({errorMessage: error.response, loading: false}) // Set loading to false on error
        })
      }

      render = () =>{
          let {albums, loading} = this.state
          return(
              <div>
                  <SearchInputComponent onSearchChange={this.searchItunes}/>
                  {loading && <p>Loading albums...</p>}
                  {!loading && albums && <ListOfAlbumsComponent albums={albums}/>}
                  {!loading && !albums && !this.state.errorMessage && <p>Search for an artist to see albums.</p>}
                  {this.state.errorMessage && <p>Error fetching albums. Please try again.</p>}
              </div>
          )
      }
}