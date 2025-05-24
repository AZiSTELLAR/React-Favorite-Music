import React from 'react'
import PropTypes from 'prop-types'
import './albumsStyles.css'

/**
 * @class SearchComponent
 * @extends {React.Component}
 * @description A component that provides a search input field.
 * It calls a callback function when the search input value changes.
 *
 * @property {object} props - The props for the component.
 * @property {function} props.onSearchChange - Callback function invoked when the search input changes. Required.
 *
 * @property {object} state - The state for the component.
 * @property {string} state.searchVal - The current value of the search input.
 */
export default class SearchComponent extends React.Component{
    constructor(props) {
        super(props)
        /**
         * @type {{searchVal: string}}
         */
        this.state = {searchVal:''}
        this.handleSearch = this.handleSearch.bind(this)
      }

      /**
       * @method handleSearch
       * @description Handles the change event of the search input.
       * Updates the component's state with the new search value and
       * calls the onSearchChange prop with the new value.
       * @param {React.ChangeEvent<HTMLInputElement>} ev - The input change event.
       */
      handleSearch = (ev) =>{
        this.setState({searchVal:ev.target.value})
        this.props.onSearchChange(ev.target.value)
      }
    render = () =>{
        return(
        <div className='searchDiv'>
            <span> Search </span>
          <input id='search' value={this.state.searchVal} onChange={this.handleSearch}/>
        </div>
            )
    }
}

SearchComponent.propTypes = {
    onSearchChange: PropTypes.func.isRequired
}