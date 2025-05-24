import React from 'react'
import SearchInputComponent from './SearchInputComponent'
import ListOfAlbumsComponent from './ListOfAlbumsComponent'

/**
 * @class FilterFavoritesComponent
 * @extends {React.Component}
 * @description This component displays and allows filtering of locally favorited albums.
 * It loads favorite albums from localStorage and provides a search input to filter them by artist name.
 *
 * @property {object} state - The state for the component.
 * @property {Array<object>} state.favedAlbums - Stores the list of albums marked as favorite by the user,
 *                                               loaded from localStorage. Each album object is expected
 *                                               to have properties like `artistName`, `show`, and `fav`.
 */
export default class FilterFavoritesComponent extends React.Component{
    /**
     * @constructor
     * @param {object} props - The component's props.
     * @description Initializes the component, sets initial `favedAlbums` state from localStorage,
     * and binds class methods.
     */
    constructor(props) {
        super(props);
        /**
         * @type {{favedAlbums: Array<object>}}
         */
        this.state = {
            favedAlbums: JSON.parse(localStorage.getItem('favedAlbums')) || []
        };
        this.searchFaves = this.searchFaves.bind(this);
        this.handleFavoriteChange = this.handleFavoriteChange.bind(this); // Bind this new method
    }

  /**
   * @method handleFavoriteChange
   * @description Updates the `favedAlbums` state when an album is unfavorited.
   * Since this component only displays favorited albums, if an album's favorite status
   * becomes true (unexpectedly from child), no state change occurs here as it should already be in the list.
   * @param {string|number} updatedAlbumId - The ID of the album whose favorite status changed.
   * @param {boolean} newFavStatus - The new favorite status. Expected to be `false` for changes.
   */
  handleFavoriteChange = (updatedAlbumId, newFavStatus) => {
    if (!newFavStatus) { // Album was unfavorited
        this.setState(prevState => {
            const updatedFavedAlbums = prevState.favedAlbums.filter(
                album => album.collectionId.toString() !== updatedAlbumId.toString()
            );
            return { favedAlbums: updatedFavedAlbums };
        });
    }
    // If newFavStatus is true, it means an album (already in favedAlbums) was "re-favorited".
    // No state change is strictly needed here as it should already be in favedAlbums.
  };

  /**
   * @method searchFaves
   * @description Filters the `favedAlbums` list based on the provided artist search term.
   * It updates the `show` property of each album in `state.favedAlbums`:
   * `show` is set to `false` if the artist name doesn't match the search term (case-insensitive),
   * and `true` otherwise. The `fav` property is ensured to be `true` for shown albums.
   * @param {string} artist - The artist name or search term to filter by.
   */
  searchFaves = (artist) => {
      let {favedAlbums} = this.state
      for (const key in favedAlbums) {
          if (favedAlbums[key].artistName.toUpperCase().indexOf(artist.toUpperCase()) === -1) {
              favedAlbums[key].show = false;
          } else {
            favedAlbums[key].show = true;
            favedAlbums[key].fav = true; 
          }
      }
      this.setState({favedAlbums})
  }

  render = () =>{
      return(
          <div>
            <SearchInputComponent onSearchChange={this.searchFaves}/>
            {/* Pass the current favedAlbums from state to ListOfAlbumsComponent */}
            <ListOfAlbumsComponent albums={this.state.favedAlbums} onFavoriteChange={this.handleFavoriteChange} />
          </div>
      )
  }


}