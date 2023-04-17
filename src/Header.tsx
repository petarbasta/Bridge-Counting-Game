import React, { Component } from 'react';
import './Header.css';

class Header extends Component<{}, {}> {

  render() {
    return (
        <header style = {{ height: '8%', width: '100%', background: 'linear-gradient(45deg, #a657a8, #a366ff)', display: 'flex' }}>

            <div style={{height: "100%", width: "50%", display: 'flex', justifyContent: 'start'}}>
                <h1 style={{ fontFamily: "didot", color: "#ead8f3",   textAlign: "right"}}>Basta Bridge</h1>
                <h1 style={{ fontFamily: "didot", color: "#ead8f3",   textAlign: "center"}}> | </h1>
                <h1 style={{ fontFamily: "didot", color: "#ead8f3",   textAlign: "left"}}>Counting Game</h1>
            </div>
            
        </header>
    );
  }
}

export default Header;