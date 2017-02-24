import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './App.css';

injectTapEventPlugin();

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="layout">
          <div className="layout-north">
            <Toggle />
          </div>
          <div className="layout-south">
            <FlatButton label="Secondary" secondary={true} />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
