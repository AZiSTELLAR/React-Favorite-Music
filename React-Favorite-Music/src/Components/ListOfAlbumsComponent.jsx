import React from 'react'
import PropTypes from 'prop-types'
import './albumsStyles.css'

/**
 * @class ListOfFavoriteAlbumsComponent
 * @extends {React.Component}
 * @description Displays a list of albums and allows users to favorite or unfavorite them.
 * It can display albums passed via props or its own list of favorited albums from localStorage.
 *
 * @property {object} props - The props for the component.
 * @property {Array<object>} props.albums - An array of album objects to display.
 * @property {function} props.onFavoriteChange - Callback function invoked when an album's favorite status changes.
 *                                               Called with `(albumId, newFavStatus)`. Required.
 *
 * @property {object} state - The state for the component.
 * @property {Array<object>} state.favedAlbums - An array of album objects currently marked as favorite,
 *                                               loaded from and synced with localStorage.
 */
export default class ListOfFavoriteAlbumsComponent extends React.Component{
    /**
     * @constructor
     * @param {object} props - The component's props.
     * @description Initializes the component, binds `favThis` method, and loads
     * initial `favedAlbums` state from localStorage.
     */
    constructor(props) {
        super(props)
        /**
         * @type {{favedAlbums: Array<object>}}
         */
        this.state = {favedAlbums: JSON.parse(localStorage.getItem('favedAlbums')) || []}
        this.favThis = this.favThis.bind(this)
      }

      /**
       * @method favThis
       * @description Handles the click event for favoriting or unfavoriting an album.
       * It updates the `favedAlbums` in localStorage and the component's state.
       * It also calls the `onFavoriteChange` prop to notify parent components.
       * @param {React.MouseEvent<HTMLElement>} event - The click event, typically from a list item representing an album.
       *                                                The `id` of the clicked element is expected to be the album's `collectionId`.
       */
      favThis = (event) =>{
          const clickedAlbumId = event.currentTarget.id; 
          if (!clickedAlbumId) return;

          let currentFavedAlbums = JSON.parse(localStorage.getItem('favedAlbums')) || [];
          // Ensure props.albums exists and is an array. If not, initialize to empty array to prevent errors.
          const propsAlbums = Array.isArray(this.props.albums) ? this.props.albums : []; 
          const albumFromProps = propsAlbums.find(a => a.collectionId.toString() === clickedAlbumId);

          const isCurrentlyFavorite = currentFavedAlbums.some(favAlbum => favAlbum.collectionId.toString() === clickedAlbumId);

          if (isCurrentlyFavorite) {
              // Unfavorite
              currentFavedAlbums = currentFavedAlbums.filter(favAlbum => favAlbum.collectionId.toString() !== clickedAlbumId);
              if (albumFromProps) {
                // Update the album in the props for immediate UI feedback if it's directly rendered from props
                const albumInPropsIndex = propsAlbums.findIndex(a => a.collectionId.toString() === clickedAlbumId);
                if (albumInPropsIndex !== -1) {
                    propsAlbums[albumInPropsIndex].fav = false;
                }
              }
          } else {
              // Favorite
              if (albumFromProps) {
                  const newFavAlbum = { ...albumFromProps, fav: true };
                  currentFavedAlbums.push(newFavAlbum);
                   // Update the album in the props for immediate UI feedback
                  const albumInPropsIndex = propsAlbums.findIndex(a => a.collectionId.toString() === clickedAlbumId);
                  if (albumInPropsIndex !== -1) {
                      propsAlbums[albumInPropsIndex].fav = true;
                  }
              } else {
                  // This case might occur if the component is used to display only favedAlbums 
                  // (e.g. on a dedicated favorites page) and the album is not in the current props.albums
                  // For now, we'll assume that if an album is being clicked, it should be in props.albums
                  // or this component's behavior needs to be reconciled with how it gets its data on a favorites page.
                  // One option: if not in props, try to find in currentFavedAlbums (though it shouldn't be there if not favorite yet)
                  // This part needs careful consideration based on usage.
                  // For now, let's log a warning if albumFromProps is not found, as per example.
                  console.warn("Attempting to favorite an album not found in props.albums: ", clickedAlbumId);
                  // To prevent adding incomplete data, we might return or ensure the album object is complete.
                  // However, the subtask implies props.albums is the primary source when available.
                  // If we are on a "favorites" page, this.props.albums might be the favedAlbums list.
                  // Let's reconsider this path if issues arise. For now, pushing based on albumFromProps is primary.
                  return; 
              }
          }

          localStorage.setItem('favedAlbums', JSON.stringify(currentFavedAlbums));
          this.setState({ favedAlbums: currentFavedAlbums });

          // Determine the new favorite status for the callback
          const newFavStatus = !isCurrentlyFavorite; 

          // Optional: Force update of parent if necessary
          if (this.props.onFavoriteChange) {
              this.props.onFavoriteChange(clickedAlbumId, newFavStatus); // Pass ID and new status
          }
      }

      /**
       * @method render
       * @description Renders the list of albums.
       * It determines which albums to display (either from `props.albums` or `state.favedAlbums`)
       * and marks them as favorite based on the `state.favedAlbums` or the album's `fav` property.
       * Only albums with `album.show === true` are rendered.
       * @returns {JSX.Element} A div container with a list of albums.
       */
      render = () =>{
        const { favedAlbums } = this.state;
        // Determine the source of albums to render. Prioritize props.albums.
        // Ensure props.albums is an array, default to an empty array if not.
        const albumsToRender = Array.isArray(this.props.albums) ? this.props.albums : favedAlbums;

          return(
            <div className='container'>
                {albumsToRender.map((album) => {
                // Determine if the current album is a favorite.
                const isFav = favedAlbums.some(fav => fav.collectionId === album.collectionId) || album.fav;
                
                // The `album.show` condition was present in the original code.
                // It's kept here assuming it's managed by parent components or has a specific purpose.
                return album.show? 
                  <li key={album.collectionId} 
                      id={album.collectionId.toString()} // Ensure ID is string
                      onClick={this.favThis} 
                      className={isFav? 'card card-1 fav': 'card card-1'} 
                      style={{backgroundImage: 'url(' + album.artworkUrl100.replace('100x100', '600x600') + ')'}}>
                      {/* Span's onClick is kept as is from original, assuming specific intention or later refinement. */}
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