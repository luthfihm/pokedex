/**
 * Created by luthfi on 12/12/16.
 */
import React, { Component, PropTypes } from 'react';
import {Row, Col,Card, CardTitle, Modal, Button, ProgressBar} from 'react-materialize';
import InfiniteScroll from 'react-infinite-scroller';
import qwest from 'qwest';

const api = {
    baseUrl: 'http://pokeapi.salestock.net:8000/api/v2'
};

class Body extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pokemons: [],
            hasMoreItems: true,
            nextHref: null
        };
    }

    loadItems(page) {
        var self = this;

        var url = api.baseUrl + '/pokemon';
        if(this.state.nextHref) {
            url = this.state.nextHref;
        }

        qwest.get(url, {limit: 12}, {cache: true})
            .then(function (xhr,resp) {
                if (resp) {
                    var pokemons = self.state.pokemons;
                    resp.results.map((pokemon) => {
                        pokemons.push(pokemon);
                    });

                    if (resp.next) {
                        self.setState({
                            pokemons: pokemons,
                            nextHref: resp.next
                        });
                    } else {
                        self.setState({
                            hasMoreItems: false
                        });
                    }
                }
            });
    }

    render() {
        const loader =
            <Row>
                <Col s={12}>
                    <ProgressBar />
                </Col>
            </Row>;
        var items = [];
        this.state.pokemons.map((pokemon, i) => {
            items.push(
                <Col s={2}>
                    <Card header={<CardTitle image={'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+(i+1)+'.png'} waves='light'/>}
                          title={pokemon.name}>
                    </Card>
                </Col>
            );
        });
        return (
            <InfiniteScroll
                pageStart={0}
                loadMore={this.loadItems.bind(this)}
                hasMore={this.state.hasMoreItems}
                loader={loader}>

                <Row>
                    {items}
                </Row>
            </InfiniteScroll>
        );
    }
}

export default Body;