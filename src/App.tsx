import React, { Component } from 'react';
import './App.css';
import { BrowserView, MobileView } from 'react-device-detect';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./pages/Game/Game";

class App extends Component<{}, {}> {

  render() {
    return (
      <>
        {/* Displays on PC  */}
        <BrowserView>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Game />} />
              <Route path="*" element={<Game />} />
            </Routes>
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