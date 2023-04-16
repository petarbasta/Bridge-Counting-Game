import React, { Component } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import Game from "./pages/Game/Game";
import NotFound from './pages/NotFound/NotFound';
import Login from './Login';
import NavBar from './NavBar';

class App extends Component<{}, {}> {

  render() {
    return (
      <>
        {/* Displays on PC  */}
        <BrowserView>
          <BrowserRouter>
            <div style = {{ height: '100vh', width: '100vw', display:'flex', flexDirection:'column'}}>
              
              <NavBar/>
              
              <div style={{ height: '92%' }}>
                <Routes>
                  <Route path="/" element={<Game />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<NotFound />} />
                </Routes> 
              </div>

            </div>
          </BrowserRouter>
        </BrowserView>
        {/* Displays on mobile */}
        <MobileView>
          <p>This application is not available on mobile yet. Try again soon!</p>
        </MobileView>
      </>
    );
  }
}

export default App;