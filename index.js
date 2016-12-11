import React from 'react';
import ReactDOM from 'react-dom';
import {Navbar, NavItem, Icon} from 'react-materialize';

const App = ({name}) =>
    <Navbar brand='Pokedex' right>
        <NavItem href='#'><Icon>search</Icon></NavItem>
        <NavItem href='#'><Icon>view_module</Icon></NavItem>
        <NavItem href='#'><Icon>refresh</Icon></NavItem>
        <NavItem href='#'><Icon>more_vert</Icon></NavItem>
    </Navbar>;

ReactDOM.render(
  <App />, document.querySelector('.react-root')
);
