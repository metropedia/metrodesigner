import React, { Component } from 'react';
import Toggle from 'material-ui/Toggle';
import { ButtonGroup, Button } from 'react-bootstrap';

class North extends Component {
  constructor(props) {
    super(props);
    this.ref = {};
    this.state = {};
  };

  change(event) {
    this.props.app.change(event);
  };

  draw() {
    this.props.app.draw();
  };

  edit() {
    this.props.app.editMetroLine();
  };

  zoomIn() {
    this.props.app.zoomIn();
  };

  zoomOut() {
    this.props.app.zoomOut();
  };

  center() {
    this.props.app.center();
  };

  newMetroLine() {
    this.props.app.newMetroLine();
  };

  useStraightPath() {
    this.props.app.useStraightPath();
  };

  useCurlyPath() {
    this.props.app.useCurlyPath();
  };

  flipLast() {
    this.props.app.flipLast();
  };

  applyLinePathChange() {
    this.props.app.applyLinePathChange();
  };

  changePathType(type) {
    this.props.app.changePathType(type);
  };

  flipPath() {
    this.props.app.flipPath();
  };

  splitLinePath() {
    this.props.app.splitLinePath();
  };

  render() {
    return (
      <div>
        <div className="control-panel">
          Width <input type="number" ref={(input) => { this.ref.width = input; }}
                       name="width"
                       onChange={this.change.bind(this)}
                       className="form-control" />
          Height <input type="number" ref={(input) => { this.ref.height = input; }}
                       name="height"
                       onChange={this.change.bind(this)}
                       className="form-control" />
          <Button bsSize="xsmall">Set Size</Button>
          <span style={{float:'right'}}><Toggle /></span>
        </div>
        <div className="control-panel">
          <ButtonGroup>
            <Button bsStyle={this.inputMode === 'draw' ? 'primary' : 'default'}
                    bsSize="xsmall"
                    onClick={this.draw.bind(this)}>Draw</Button>
            <Button bsStyle={this.inputMode === 'edit' ? 'primary' : 'default'}
                    bsSize="xsmall"
                    onClick={this.edit.bind(this)}>Edit</Button>
          </ButtonGroup>
    
          <Button bsSize="xsmall">Save</Button>

          <Button bsSize="xsmall">Export</Button>

          <Button bsSize="xsmall"
                  onClick={this.zoomIn.bind(this)}>Zoom In +</Button>

          <Button bsSize="xsmall"
                  onClick={this.zoomOut.bind(this)}>Zoom Out -</Button>
    
          <label>{this.scalePercentage}%</label>
    
          <Button bsSize="xsmall"
                  onClick={this.center.bind(this)}>Center & 100%</Button>
        </div>
        <div className="control-panel"
             hidden={this.inputMode !== 'draw'}>
          <Button bsSize="xsmall"
                  onClick={this.newMetroLine.bind(this)}>New Metro Line</Button>
          <ButtonGroup>
            <Button bsStyle={this.pathType === 'straight' ? 'primary' : 'default'}
                    bsSize="xsmall"
                    onClick={this.useStraightPath.bind(this)}>Straight</Button>
            <Button bsStyle={this.pathType === 'curly' ? 'primary' : 'default'}
                    bsSize="xsmall"
                    onClick={this.useCurlyPath.bind(this)}>Curly</Button>
          </ButtonGroup>
          <Button bsSize="xsmall"
                  onClick={this.flipLast.bind(this)}>Flip</Button>
        </div>
        <div className="control-panel input-group-sm"
             hidden={this.inputMode !== 'edit'}>
          <label>
          x1 <input type="number" step="20"
                    ref={(input) => { this.ref.x1 = input; }}
                    className="form-control"
                    onChange={this.applyLinePathChange.bind(this)} />
          </label>
          <label>
          y1 <input type="number" step="20"
                    ref={(input) => { this.ref.y1 = input; }}
                    className="form-control"
                    onChange={this.applyLinePathChange.bind(this)} />
          </label>
          <label>
          x2 <input type="number" step="20"
                    ref={(input) => { this.ref.x2 = input; }}
                    className="form-control"
                    onChange={this.applyLinePathChange.bind(this)} />
          </label>
          <label>
          y2 <input type="number" step="20"
                    ref={(input) => { this.ref.y2 = input; }}
                    className="form-control"
                    onChange={this.applyLinePathChange.bind(this)} />
          </label>
          <label>type</label>
          <ButtonGroup>
            <Button bsStyle={this.currentEditJoint.data.type === 'straight' ? 'primary' : 'default'}
                    bsSize="xsmall"
                    onClick={this.changePathType.bind(this, 'straight')}>Straight</Button>
            <Button bsStyle={this.currentEditJoint.data.type === 'curly' ? 'primary' : 'default'}
                    bsSize="xsmall"
                    onClick={this.changePathType.bind(this, 'curly')}>Curly</Button>
          </ButtonGroup>
          <label>
          flipped
            <input type="checkbox"
                   ref={(input) => { this.ref.flipped = input; }}
                   onChange={this.flipPath.bind(this)} />
          </label>
          <label>split</label>
            <Button bsSize="xsmall"
                    onClick={this.splitLinePath.bind(this)}>Split</Button>
        </div>
      </div>
    );
  };

  componentWillMount() {
    let app = this.props.app.state;
    this.currentEditJoint = app.currentEditJoint;
  };

  componentWillUpdate() {
    let app = this.props.app.state;
    this.ref.width.value = app.width;
    this.ref.height.value = app.height;

    if (app.currentEditJoint) {
      this.currentEditJoint = app.currentEditJoint;
      this.ref.x1.value = app.currentEditJoint.data.x1 || NaN;
      this.ref.y1.value = app.currentEditJoint.data.y1 || NaN;
      this.ref.x2.value = app.currentEditJoint.data.x2 || NaN;
      this.ref.y2.value = app.currentEditJoint.data.y2 || NaN;
      this.ref.flipped.checked = this.currentEditJoint.data.flipped;
    }

    this.inputMode = app.inputMode;
    this.pathType = app.pathType;
    this.scalePercentage = app.scalePercentage;
    console.log(this.props.app.state);
  };
}

export default North;
