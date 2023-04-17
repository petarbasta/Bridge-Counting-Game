import { Component } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import Game from "./Game";
import Header from "./Header";

class App extends Component<{}, {}> {

  render() {
    return (
      <>
        {/* Displays on PC  */}
        <BrowserView>
            <div style = {{ height: '100vh', width: '100vw', display:'flex', flexDirection:'column'}}>

              <Header/>
              <Game/>

            </div>
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