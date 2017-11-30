import React from 'react'
import { NavLink } from 'react-router-dom'
import './App.css'
class Nav extends React.Component {
    render(){
        return(
            <ul>
                <li>
                    <NavLink exact to='/' activeStyle={{
                        fontWeight: 'bold',
                        color: 'red'
                    }}>
                        Search
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/favorites' activeStyle={{
                        fontWeight: 'bold',
                        color: 'red'
                    }}>
                        Favorite Albums
                    </NavLink>
                </li>
            </ul>)
    }
}

export default Nav