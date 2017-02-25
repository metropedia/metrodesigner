import React, { Component } from 'react';
import Toggle from 'material-ui/Toggle';

class North extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  change(event) {
    this.props.app.change(event);
  };

  render() {

    return (
      <div>
        {this.props.app.state.width},
        {this.props.app.state.height}
        <Toggle />
        <div className="control-panel">
          Width <input type="number" ref={(input) => { this.width = input; }}
                       name="width"
                       onChange={this.change.bind(this)}
                       className="form-control" />
          Height <input type="number" ref={(input) => { this.height = input; }}
                       name="height"
                       onChange={this.change.bind(this)}
                       className="form-control" />
          <button className="btn btn-sm">Set Size</button>
        </div>
      </div>
    );
  };

  componentDidUpdate() {
    let props = this.props;
    this.width.value = props.app.state.width;
    this.height.value = props.app.state.height;
  };
}

export default North;
