import React, { Component } from 'react';
import Toggle from 'material-ui/Toggle';
import { ButtonGroup, Button } from 'react-bootstrap';

class North extends Component {
  constructor(props) {
    super(props);
    this.ref = {};
  };

  changeCanvasWidth(event) {
    this.props.changeCanvasWidth(event);
  };

  changeCanvasHeight(event) {
    this.props.changeCanvasHeight(event);
  };

  draw() {
    this.props.draw(this.props.metro);
  };

  edit() {
    this.props.edit(this.props.metro);
  };

  zoomIn() {
    this.props.zoomIn(this.props.metro);
  };

  zoomOut() {
    this.props.zoomOut(this.props.metro);
  };

  center() {
    this.props.center(this.props.metro);
  };

  newMetroLine() {
    this.props.newMetroLine(this.props.metro);
  };

  useStraightPath() {
    this.props.useStraightPath();
  };

  useCurlyPath() {
    this.props.useCurlyPath();
  };

  flipLast() {
    this.props.flipLast();
  };

  applyLinePathChange() {
    this.props.applyLinePathChange();
  };

  changePathType(type) {
    this.props.changePathType(type);
  };

  flipPath() {
    this.props.flipPath();
  };

  splitLinePath() {
    this.props.splitLinePath();
  };

  render() {
    return (
      <div>
        <div className="control-panel">
          Width <input type="number" ref={(input) => { this.ref.width = input; }}
                       name="width"
                       onChange={this.changeCanvasWidth.bind(this)}
                       className="form-control" />
          Height <input type="number" ref={(input) => { this.ref.height = input; }}
                       name="height"
                       onChange={this.changeCanvasHeight.bind(this)}
                       className="form-control" />
          <Button bsSize="xsmall">Set Size</Button>
          <span style={{float:'right'}}><Toggle /></span>
        </div>
        <div className="control-panel">
          <ButtonGroup>
            <Button bsStyle={this.props.inputMode === 'draw' ? 'primary' : 'default'}
                    bsSize="xsmall"
                    onClick={this.draw.bind(this)}>Draw</Button>
            <Button bsStyle={this.props.inputMode === 'edit' ? 'primary' : 'default'}
                    bsSize="xsmall"
                    onClick={this.edit.bind(this)}>Edit</Button>
          </ButtonGroup>
    
          <Button bsSize="xsmall">Save</Button>

          <Button bsSize="xsmall">Export</Button>

          <Button bsSize="xsmall"
                  onClick={this.zoomIn.bind(this)}>Zoom In +</Button>

          <Button bsSize="xsmall"
                  onClick={this.zoomOut.bind(this)}>Zoom Out -</Button>
    
          <label>{this.props.scalePercentage}%</label>
    
          <Button bsSize="xsmall"
                  onClick={this.center.bind(this)}>Center & 100%</Button>
        </div>
        <div className="control-panel"
             hidden={this.props.inputMode !== 'draw'}>
          <Button bsSize="xsmall"
                  onClick={this.newMetroLine.bind(this)}>New Metro Line</Button>
          <ButtonGroup>
            <Button bsStyle={this.props.pathType === 'straight' ? 'primary' : 'default'}
                    bsSize="xsmall"
                    onClick={this.useStraightPath.bind(this)}>Straight</Button>
            <Button bsStyle={this.props.pathType === 'curly' ? 'primary' : 'default'}
                    bsSize="xsmall"
                    onClick={this.useCurlyPath.bind(this)}>Curly</Button>
          </ButtonGroup>
          <Button bsSize="xsmall"
                  onClick={this.flipLast.bind(this)}>Flip</Button>
        </div>
        <div className="control-panel input-group-sm"
             hidden={this.props.inputMode !== 'edit'}>
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
            <Button bsStyle={this.props.currentEditJoint.data.type === 'straight' ? 'primary' : 'default'}
                    bsSize="xsmall"
                    onClick={this.changePathType.bind(this, 'straight')}>Straight</Button>
            <Button bsStyle={this.props.currentEditJoint.data.type === 'curly' ? 'primary' : 'default'}
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
  };

  componentWillUpdate() {

  };

  componentDidUpdate() {
    const props = this.props;
    this.ref.width.value = props.width;
    this.ref.height.value = props.height;
    if (props.currentEditJoint.data) {
      this.ref.x1.value = props.currentEditJoint.data.x1;
      this.ref.y1.value = props.currentEditJoint.data.y1;
      this.ref.x2.value = props.currentEditJoint.data.x2;
      this.ref.y2.value = props.currentEditJoint.data.y2;
      this.ref.flipped.checked = props.currentEditJoint.data.flipped;
    }
  };
}

export default North;
