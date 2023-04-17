import React, { Component } from 'react';
import './Header.css';

class Header extends Component<{}, {}> {

  render() {
    return (
        <header style = {{ height: '8%', width: '100%', background: 'linear-gradient(45deg, #a657a8, #a366ff)', display: 'flex' }}>

            <div style={{height: "100%", width: "50%", display: 'flex', justifyContent: 'start', marginLeft: "1%"}}>
                <h2 style={{ fontFamily: "didot", color: "#ead8f3", textAlign: "right"}}>Basta Bridge</h2>
                <h2 style={{ fontFamily: "didot", color: "#ead8f3", textAlign: "center", marginLeft: "1%", marginRight: "1%"}}> | </h2>
                <h2 style={{ fontFamily: "didot", color: "#ead8f3", textAlign: "left"}}>Counting Game</h2>
            </div>
            
        </header>
    );
  }
}

export default Header;