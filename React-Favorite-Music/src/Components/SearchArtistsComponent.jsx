import React from 'react'
import SearchInputComponent from './SearchInputComponent'
import ListOfAlbumsComponent from './ListOfAlbumsComponent'
import axios from 'axios'

/**
 * @class SearchArtistsComponent
 * @extends {React.Component}
 * @description This component allows users to search for albums using the iTunes API
 * and displays the results. It also interacts with a list of locally favorited albums
 * to show favorite status on search results.
 *
 * @property {object} state - The state for the component.
 * @property {Array<object>} state.albums - Stores the albums fetched from the iTunes API.
 * @property {Array<object>} state.favedAlbums - Stores the list of albums marked as favorite by the user,
 *                                               loaded from and synced with localStorage.
 * @property {string} state.errorMessage - Stores any error message to be displayed, e.g., API errors.
 */
export default class SearchArtistsComponent extends React.Component{
    /**
     * @constructor
     * @param {object} props - The component's props.
     * @description Initializes the component, sets initial state (including loading `favedAlbums`
     * from localStorage), and binds class methods.
     */
    constructor(props) {
        super(props)
        /**
         * @type {{albums: Array<object>, favedAlbums: Array<object>, errorMessage: string}}
         */
        this.state = {
            albums: [], // Initialize albums state
            favedAlbums: JSON.parse(localStorage.getItem('favedAlbums')) || [],
            errorMessage: '' // Initialize errorMessage state
        }
        this.searchItunes = this.searchItunes.bind(this)
        this.handleFavoriteChange = this.handleFavoriteChange.bind(this); // Bind new method
      }

      /**
       * @method handleFavoriteChange
       * @description Updates the favorite status of an album in the `state.albums` list
       * and synchronizes the `state.favedAlbums` list.
       * If an album is favorited, it's added to `favedAlbums`.
       * If unfavorited, it's removed from `favedAlbums`.
       * @param {string|number} updatedAlbumId - The ID of the album whose favorite status changed.
       * @param {boolean} newFavStatus - The new favorite status (true if favorited, false if unfavorited).
       */
      handleFavoriteChange = (updatedAlbumId, newFavStatus) => {
        this.setState(prevState => ({
            albums: prevState.albums.map(album =>
                album.collectionId.toString() === updatedAlbumId.toString()
                    ? { ...album, fav: newFavStatus }
                    : album
            ),
            // Also update the local favedAlbums state to be consistent
            favedAlbums: newFavStatus
                ? [...prevState.favedAlbums, prevState.albums.find(a => a.collectionId.toString() === updatedAlbumId.toString())]
                : prevState.favedAlbums.filter(a => a.collectionId.toString() !== updatedAlbumId.toString())
        }));
      };

      /**
       * @method searchItunes
       * @description Fetches albums from the iTunes API based on the provided artist search term.
       * It processes the results to mark albums as favorite if they exist in `state.favedAlbums`
       * and sets `show = true` for all fetched albums. Updates `state.albums` with the results
       * or `state.errorMessage` on failure.
       * @param {string} artist - The artist name or search term to query the iTunes API.
       */
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
          this.setState({errorMessage: 'Failed to fetch albums. Please try again later.'})
        })
      }

      render = () =>{
          let {albums, errorMessage} = this.state
          return(
              <div>
                  <SearchInputComponent onSearchChange={this.searchItunes}/>
                  {errorMessage && <p>{errorMessage}</p>}
                  {albums && albums.length > 0 ? <ListOfAlbumsComponent albums={albums} onFavoriteChange={this.handleFavoriteChange} /> : null}
              </div>
          )
      }
}