import React, { Component } from 'react';
import './NavBar.css';
import { NavLink } from "react-router-dom";

class NavBar extends Component<{}, {}> {

  render() {
    return (
        <header className = "header" >
            <nav style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <ul style={{ display: 'flex', listStyle: 'none' }}>
                <li>
                <NavLink to="/">
                    <button className="primaryButton">
                    Home
                    </button>
                </NavLink>
                </li>
                <li>
                <NavLink to="/login">
                    <button className="primaryButton">
                    Login
                    </button>
                </NavLink>
                </li>
            </ul>
            </nav>
        </header>
    );
  }
}

export default NavBar;