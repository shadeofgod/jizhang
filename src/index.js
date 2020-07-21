import 'preact/debug';
import 'regenerator-runtime/runtime.js';

import React from 'react';
import { render } from 'react-dom';

import('./app').then(({ App }) => {
  render(<App />, document.querySelector('#app'));
});
