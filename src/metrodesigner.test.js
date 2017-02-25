import React from 'react';
import ReactDOM from 'react-dom';
import MetroDesigner from './metrodesigner';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MetroDesigner />, div);
});
