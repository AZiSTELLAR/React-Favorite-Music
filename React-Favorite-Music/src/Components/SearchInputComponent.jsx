import React from 'react'
import PropTypes from 'prop-types'
import './albumsStyles.css'

export default class SearchComponent extends React.Component{
    constructor(props) {
        super(props)
        this.state = {searchVal:''}
        this.handleSearch = this.handleSearch.bind(this)
      }
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