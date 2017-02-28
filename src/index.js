import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import designer from './reducers'
import MetroDesigner from './components/metrodesigner';
import './index.css';

let store = createStore(designer);

ReactDOM.render(
  <Provider store={store}>
    <MetroDesigner />
  </Provider>,
  document.getElementById('root')
);
