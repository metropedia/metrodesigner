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
    this.state = {
      metroLines: [],
      currentEditJoint: {
        data: {
          x1: 0, y1: 0,
          x2: 0, y2: 0
        }
      },
      scalePercentage: 100.00
    };
  };

  change(event) {
    let state = {};
    state[event.target.name] = event.target.valueAsNumber || event.target.value;

    this.setState(state);
  };

  zoomIn() {
    this.metro.zoomIn(1.5);
  }; 

  zoomOut() {
    this.metro.zoomOut(0.75);
  }; 

  center(x, y, k) {
    this.metro.center(x, y, k);
  }; 

  newMetroLine() {
    const metroLine = this.metro.addMetroLine();
    const currentMetroLine = this.metro.setCurrentMetroLine(metroLine);

    this.setState({
      metroLines: this.metro.getMetroLines(),
      currentMetroLine: currentMetroLine
    });
  };

  editMetroLine() {
    const el = this.metro.getElements();
    el.pointer.classed('hide', true);
    el.shade.classed('hide', true);
    el.svg.classed('input-mode-select', true);

    this.setState({
      inputMode: this.metro.setInputMode('edit')
    });
  };

  draw() {
    const el = this.metro.getElements();
    el.pointer.classed('hide', false);
    el.shade.classed('hide', false);
    el.svg.classed('input-mode-select', false);

    this.setState({
      inputMode: this.metro.setInputMode('draw')
    });
  };

  useStraightPath() {
    this.setState({
      pathType: this.metro.setPathType('straight')
    });
  };

  useCurlyPath() {
    this.setState({
      pathType: this.metro.setPathType('curly')
    });
  };

  flipLast() {
    let metroLine = this.metro.getCurrentMetroLine();
    // eslint-disable-next-line
    let layerMetroLine = metroLine.layers.metroLine;
    // eslint-disable-next-line
    let layerLinePaths = metroLine.layers.linePaths;
    let layerJoints = metroLine.layers.joints;

    let jointData = layerJoints.select('.joint:last-child').datum();
    let linePath = jointData.linePath;
    let linePathData = linePath.datum();
    linePathData.flipped = !linePathData.flipped;
    linePathData.linePath = this.metro.drawLinePath(
      linePathData.x1, linePathData.y1,
      linePathData.x2, linePathData.y2,
      linePathData.type,
      linePathData.flipped,
      linePath
    );
  };

  flipPath() {
    var flipped = !this.metro.currentEditJoint.data.flipped;
    this.metro.currentEditJoint.data.flipped = flipped;
    this.applyLinePathChange();
    this.setState({
      currentEditJoint: this.metro.currentEditJoint
    });
  };

  changePathType(type) {
    this.metro.currentEditJoint.data.type = type;
    this.applyLinePathChange();
    this.setState({
      currentEditJoint: this.metro.currentEditJoint
    });
  };

  applyLinePathChange() {
    let linePathJoint = this.metro.getCurrentEditJoint();
    this.metro.drawLinePath(
      linePathJoint.data.x1, linePathJoint.data.y1,
      linePathJoint.data.x2, linePathJoint.data.y2,
      linePathJoint.data.type,
      linePathJoint.data.flipped,
      linePathJoint.linePath
    );
  };

  splitLinePath() {
    const linePathJoint = this.metro.getCurrentEditJoint();
    const d = linePathJoint.data;
    const dx = (d.x2 - d.x1)/2;
    const dy = (d.y2 - d.y1)/2;
    const left = {
      x1: d.x1, y1: d.y1,
      x2: d.x1 + dx, y2: d.y1 + dy,
      type: d.type,
      flipped: d.flipped
    };
    const right = {
      x1: d.x2 - dx, y1: d.y2 - dy,
      x2: d.x2, y2: d.y2,
      type: d.type,
      flipped: d.flipped
    };

    this.metro.drawLinePath(
      left.x1, left.y1,
      left.x2, left.y2,
      left.type, left.flipped,
      null,
      linePathJoint.linePath
    );
    this.metro.drawLinePath(
      right.x1, right.y1,
      right.x2, right.y2,
      right.type, right.flipped,
      null,
      linePathJoint.linePath
    );

    linePathJoint.joint.remove();
    linePathJoint.linePath.remove();

    this.setState({
      currentEditJoint: linePathJoint
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
    let startScale = 0.76;
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

    this.metro.on('zooming', function(transform) {
      this.setState({
        scalePercentage: parseFloat((transform.k * 100).toFixed(2))
      });
    }.bind(this));

    this.metro.on('jointDrag', function(jointData) {
      this.setState({
        currentEditJoint: jointData
      });
    }.bind(this));
  
    this.metro.on('jointMouseDown', function(jointData) {
      this.setState({
        currentEditJoint: jointData
      });
    }.bind(this));
  
    this.metro.on('splashButtonClick', function() {
      this.newMetroLine();
    }.bind(this));
  
    this.metro.on('canvasMouseClick', function(shadePos) {
      this.setState({
        metroLines: this.metro.getMetroLines()
      });
    }.bind(this));

console.log(this.metro.width/2*(1-startScale), this.metro.height/2*(1-startScale), startScale)
    this.center(this.metro.width/2*(1-startScale), this.metro.height/2*(1-startScale), startScale);

    this.setState(this.metro);
  };

  componentWillUpdate() {
    //console.log(this.state);
  };
}

export default MetroDesigner;
