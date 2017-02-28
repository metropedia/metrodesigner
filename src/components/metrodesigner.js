import React, { Component } from 'react';
import { connect } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Metro from '../vendors/metrojs/metro';
import North from './north';

import './metrodesigner.css';

injectTapEventPlugin();

class MetroDesigner extends Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
    this.state = {};
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
            <North {...this.props} metro={this.metro}/>
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
    const change = {
      type: 'INIT',
      states: {
        inputMode: 'draw',
        pathType: 'straight',
        width: container.offsetWidth,
        height: container.offsetHeight,
        container: container,
      }
    };
    this.dispatch(change);
  };

  componentDidUpdate() {
    if (!this.metro) {
      const def = this.props;
      this.metro = new Metro(def);
      this.metro.on('zooming', function(transform) {
        const action = {
          type: 'ZOOMING',
          scalePercentage: parseFloat((transform.k * 100).toFixed(2))
        };
        this.dispatch(action);
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
        this.props.newMetroLine(this.metro);
      }.bind(this));
    
      this.metro.on('canvasMouseClick', function(shadePos) {
        this.setState({
          metroLines: this.metro.getMetroLines()
        });
      }.bind(this));
  
      this.props.center(
        this.metro,
        this.metro.width/2*(1-def.scalePercentage),
        this.metro.height/2*(1-def.scalePercentage),
        def.scalePercentage
      );
    }
  };
}

// https://github.com/reactjs/react-redux/blob/master/docs/api.md#api

function mapStateToProps(state) {
  return {...state};
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: dispatch,

    newMetroLine(metro) {
      const action = {
        type: 'NEW_METRO_LINE',
        states: {
          metroLines: metro.getMetroLines(),
          currentMetroLine: metro.setCurrentMetroLine(metro.addMetroLine())
        }
      };
      dispatch(action);
    },

    changeCanvasWidth(event) {
      const action = {
        type: 'CHANGE_CANVAS_WIDTH',
        width: event.target.valueAsNumber
      };
      dispatch(action);
    },

    changeCanvasHeight(event) {
      const action = {
        type: 'CHANGE_CANVAS_HEIGHT',
        height: event.target.valueAsNumber
      };
      dispatch(action);
    },

    draw(metro) {
      const el = metro.getElements();
      el.pointer.classed('hide', false);
      el.shade.classed('hide', false);
      el.svg.classed('input-mode-select', false);

      const action = {
        type: 'SET_INPUT_MODE',
        inputMode: metro.setInputMode('draw')
      };
      dispatch(action);
    },

    edit(metro) {
      const el = metro.getElements();
      el.pointer.classed('hide', true);
      el.shade.classed('hide', true);
      el.svg.classed('input-mode-select', true);
  
      const action = {
        type: 'SET_INPUT_MODE',
        inputMode: metro.setInputMode('edit')
      };
      dispatch(action);
    },

    zoomIn(metro) {
      metro.zoomIn(1.5);
    }, 
  
    zoomOut(metro) {
      metro.zoomOut(0.75);
    }, 
  
    center(metro, x, y, k) {
      metro.center(x, y, k);
    },


  };
}

MetroDesigner = connect(mapStateToProps, mapDispatchToProps)(MetroDesigner);

export default MetroDesigner;
