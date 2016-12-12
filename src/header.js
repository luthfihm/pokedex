/**
 * Created by luthfi on 12/11/16.
 */
import React, { Component, PropTypes } from 'react';
import {Navbar, NavItem, Icon} from 'react-materialize';

class Header extends Component {
    render() {
        return (
            <Navbar brand='Pokedex' right>
                <NavItem href='#'><Icon>search</Icon></NavItem>
                <NavItem href='#'><Icon>view_module</Icon></NavItem>
                <NavItem href='#'><Icon>refresh</Icon></NavItem>
                <NavItem href='#'><Icon>more_vert</Icon></NavItem>
            </Navbar>
        );
    }
}

export default Header;