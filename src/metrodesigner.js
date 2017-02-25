import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Metro from './vendor/metrojs/metro';
import North from './north';

import './metrodesigner.css';

injectTapEventPlugin();

class MetroDesigner extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.change = this.change.bind(this);
  };

  change(event) {
    let state = {};
    state[event.target.name] = event.target.valueAsNumber || event.target.value;
    this.setState(state, ()=>{
      console.log(this.state);
    });
  };

  render() {
    return (
      <MuiThemeProvider>
        <div className="layout">
          <div className="layout-north">
            <North app={this} />
          </div>
          <div className="layout-south"
               ref={(div) => { this.container = div; }}>
          </div>
        </div>
      </MuiThemeProvider>
    );
  };

  componentDidMount() {
    let container = this.container;
    let def = {
      pointerRadius: 10,
      width: container.offsetWidth,
      height: container.offsetHeight,
      resolution: 20,
      container: container,
      inputMode: 'draw',
      pathType: 'straight',
    };
    this.metro = new Metro(def);
    this.setState(this.metro);
  };
}

export default MetroDesigner;
