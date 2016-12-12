import React from 'react';
import ReactDOM from 'react-dom';
import Header from './src/header';
import Body from './src/body';

var App = ({name}) =>
    <div>
        <Header />
        <Body />
    </div>;

ReactDOM.render(
  <App />, document.querySelector('.react-root')
);
