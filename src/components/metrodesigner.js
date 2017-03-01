import React, { Component } from 'react';
import { connect } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Metro from '../vendors/metrojs/metro';
import North from './north';

import './metrodesigner.css';

injectTapEventPlugin();

class MetroDesigner extends Component {

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
    const container = this.container;
    const def = {
      width: container.offsetWidth,
      height: container.offsetHeight,
      container: container,
    };
    const metro = new Metro(def);

    /*
    metro.on('zooming', function(transform) {
      this.props.zooming(metro, transform);
    }.bind(this));
    */

    metro.on('jointDrag', function(jointData) {
      this.props.jointDrag(metro, jointData);
    }.bind(this));
    
    metro.on('jointMouseDown', function(jointData) {
      this.props.jointMouseDown(metro, jointData);
    }.bind(this));
    
    metro.on('splashButtonClick', function() {
      this.props.newMetroLine(metro);
    }.bind(this));
    
    metro.on('canvasMouseClick', function(shadePos) {
      this.props.canvasMouseClick(metro);
    }.bind(this));

    this.props.init(def);

    this.props.center(
      metro,
      metro.width/2*(1-this.props.scalePercentage),
      metro.height/2*(1-this.props.scalePercentage),
      this.props.scalePercentage
    );

    this.metro = metro;
  };

  componentDidUpdate() {
  };
}

// https://github.com/reactjs/react-redux/blob/master/docs/api.md#api

function mapStateToProps(state) {
  return {...state};
}

function mapDispatchToProps(dispatch) {
  return {
    newMetroLine(metro) {
      const action = {
        type: 'NEW_METRO_LINE',
        metroLines: metro.getMetroLines(),
        currentMetroLine: metro.setCurrentMetroLine(metro.addMetroLine())
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
      const action = {
        type: 'ZOOMING',
        scaleBy: 1.5
      };
      metro.zoomIn(action.scaleBy);
      dispatch(action);
    }, 
  
    zoomOut(metro) {
      const action = {
        type: 'ZOOMING',
        scaleBy: 0.75
      };
      metro.zoomOut(action.scaleBy);
      dispatch(action);
    }, 
  
    center(metro, x, y, k) {
      const action = {
        type: 'CENTER',
        scalePercentage: k || 1
      };
      metro.center(x, y, k);
      dispatch(action);
    },

    usePathType(metro, type) {
      const action = {
        type: 'USE_PATH_TYPE',
        pathType: metro.setPathType(type)
      };
      dispatch(action);
    },

    flipLast(metro) {
      let metroLine = metro.getCurrentMetroLine();
      // eslint-disable-next-line
      let layerMetroLine = metroLine.layers.metroLine;
      // eslint-disable-next-line
      let layerLinePaths = metroLine.layers.linePaths;
      let layerJoints = metroLine.layers.joints;
  
      let jointData = layerJoints.select('.joint:last-child').datum();
      let linePath = jointData.linePath;
      let linePathData = linePath.datum();
      metro.drawLinePath(
        linePathData.x1, linePathData.y1,
        linePathData.x2, linePathData.y2,
        linePathData.type,
        !linePathData.flipped,
        linePath
      );
      const action = {
        type: 'FLIP_LAST',
        metroLines: metro.getMetroLines()
      };
      dispatch(action);
    },

    applyLinePathChange(metro, data = {}) {
      let linePathJoint = metro.getCurrentEditJoint();
      let linePath = metro.drawLinePath(
        linePathJoint.data.x1, linePathJoint.data.y1,
        linePathJoint.data.x2, linePathJoint.data.y2,
        data.type || linePathJoint.data.type,
        data.flipping ? !linePathJoint.data.flipped : linePathJoint.data.flipped,
        linePathJoint.linePath
      );
      metro.setCurrentEditJoint({
        data: linePath.datum(),
        joint: linePathJoint.joint,
        linePath: linePath
      })
      const action = {
        type: 'APPLY_PATH_CHANGE',
        currentEditJoint: metro.getCurrentEditJoint()
      };
      dispatch(action);
    },

    splitLinePath(metro) {
      const linePathJoint = metro.getCurrentEditJoint();
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

      metro.drawLinePath(
        left.x1, left.y1,
        left.x2, left.y2,
        left.type, left.flipped,
        null,
        linePathJoint.linePath
      );
      metro.drawLinePath(
        right.x1, right.y1,
        right.x2, right.y2,
        right.type, right.flipped,
        null,
        linePathJoint.linePath
      );
  
      linePathJoint.joint.remove();
      linePathJoint.linePath.remove();

      metro.updateBBox();

      const action = {
        type: 'SPLIT_PATH',
        metroLines: metro.getMetroLines()
      };
      dispatch(action);
    },

    jointDrag(metro, jointData) {
      const action = {
        type: 'JOINT_DRAG',
        currentEditJoint: jointData
      };
      dispatch(action);
    },

    jointMouseDown(metro, jointData) {
      const action = {
        type: 'JOINT_MOUSE_DOWN',
        currentEditJoint: jointData
      };
      dispatch(action);
    },

    canvasMouseClick(metro) {
      const action = {
        type: 'CANVAS_MOUSE_CLICK',
        metroLines: metro.getMetroLines()
      };
      dispatch(action);
    },

    init(def) {
      const action = {
        type: 'INIT',
        def: def
      };
      dispatch(action);
    }

  };
}

MetroDesigner = connect(mapStateToProps, mapDispatchToProps)(MetroDesigner);

export default MetroDesigner;
