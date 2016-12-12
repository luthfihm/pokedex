import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router'
import Header from './src/header';
import PokemonList from './src/pokemon-list';
import PokemonDetails from './src/pokemon-details';

var App = ({name}) =>
    <div>
        <Header />
        <PokemonList />
    </div>;

ReactDOM.render(
  <App />, document.querySelector('.react-root')
);
