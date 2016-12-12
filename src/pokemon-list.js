/**
 * Created by luthfi on 12/12/16.
 */
import React, { Component, PropTypes } from 'react';
import {Row, Col,Card, CardTitle, Modal, Button, ProgressBar, Preloader, Table, Chip, Input} from 'react-materialize';
import InfiniteScroll from 'react-infinite-scroller';
import qwest from 'qwest';
import { Router, Route, Link, browserHistory } from 'react-router'

var capitalize = require('capitalize');

const api = {
    baseUrl: 'http://pokeapi.salestock.net:8000/api/v2'
};

class PokemonList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pokemons: [],
            allPokemons: [],
            hasMoreItems: true,
            nextHref: null,
            searchQuery: ''
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        var query = event.target.value;
        this.setState({
            searchQuery: query
        });
        if (query == '') {
            this.setState({
                hasMoreItems: true
            });
        } else {
            var pokemons = [];
            this.state.allPokemons.map((pokemon) => {
                if (pokemon.name.search(query) != -1) {
                    pokemons.push(pokemon);
                }
            });
            this.setState({
                pokemons: pokemons,
                hasMoreItems: false
            });
        }
    };

    loadItems(page) {
        var self = this;

        var url = api.baseUrl + '/pokemon';
        if(this.state.nextHref) {
            url = this.state.nextHref;
        }

        qwest.get(url, {limit: 6}, {cache: true})
            .then(function (xhr,resp) {
                if (resp) {
                    var pokemons = self.state.pokemons;
                    var allPokemons = self.state.allPokemons;
                    resp.results.map((pokemon) => {
                        qwest.get(pokemon.url, {}, {cache:true, async: false})
                            .then(function (xhr, res) {
                                if (res) {
                                    allPokemons[res.id] = res;
                                    if (pokemon.name.search(self.state.searchQuery) != -1) {
                                        pokemons[res.id] = res;
                                    }
                                }
                            })
                            .send();
                    });

                    if (self.state.searchQuery == '')
                        pokemons = allPokemons;

                    self.setState({
                        pokemons: pokemons,
                        allPokemons: allPokemons
                    });

                    if (resp.next) {
                        self.setState({
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

    loadStats(stats){
        var statsRow =[];
        stats.map((stat) => {
            statsRow.push(
                <tr>
                    <td width="30%">{stat.stat.name}</td>
                    <td width="50%">
                        <ProgressBar progress={stat.base_stat/1.5}/>
                    </td>
                    <td>{stat.base_stat}</td>
                </tr>
            );
        });
        return statsRow;
    }

    loadTypes(types) {
        var typeChips= [];
        types.map((type)=> {
            typeChips.push(
                <Chip>{type.type.name}</Chip>
            );
        });
        return typeChips;
    }

    loadAbilities(abilities) {
        var abilitiesText = "";
        for (var i=0;i < abilities.length;i++) {
            if (i < abilities.length-1) {
                abilitiesText += abilities[i].ability.name + ', ';
            } else {
                abilitiesText += abilities[i].ability.name;
            }
        }
        return abilitiesText;
    }

    loadNaturalMoves(moves) {
        var naturalMoves = [];
        moves.map((move) => {
            if (move.version_group_details[0].move_learn_method.name == 'level-up') {
                var naturalMove = {
                    level: move.version_group_details[0].level_learned_at,
                    name: move.move.name
                };
                naturalMoves.push(naturalMove);
            }
        });
        if (naturalMoves.length == 0) {
            return;
        } else {
            naturalMoves.sort(this.compareMoves);
            var moveRows = [];
            naturalMoves.map((naturalMove) => {
                moveRows.push(
                    <tr>
                        <td width="10%">{naturalMove.level}</td>
                        <td>{naturalMove.name}</td>
                    </tr>
                );
            });
            return (
                <div>
                    <h5>Natural Moves</h5>
                    <Table>
                        <tbody>
                            {moveRows}
                        </tbody>
                    </Table>
                </div>
            );
        }
    }

    loadMachineMoves(moves) {
        var machineMoves = [];
        moves.map((move) => {
            if (move.version_group_details[0].move_learn_method.name == 'machine') {
                var machineMove = {
                    level: '',
                    name: move.move.name
                };
                machineMoves.push(machineMove);
            }
        });
        if (machineMoves.length == 0) {
            return;
        } else {
            machineMoves.sort(this.compareMoves);
            var moveRows = [];
            machineMoves.map((machineMove) => {
                moveRows.push(
                    <tr>
                        <td width="10%">{machineMove.level}</td>
                        <td>{machineMove.name}</td>
                    </tr>
                );
            });
            
            return (
                <div>
                    <h5>Machine Moves</h5>
                    <Table>
                        <tbody>
                        {moveRows}
                        </tbody>
                    </Table>
                </div>
            );
        }
    }

    loadTutorMoves(moves) {
        var tutorMoves = [];
        moves.map((move) => {
            if (move.version_group_details[0].move_learn_method.name == 'tutor') {
                var tutorMove = {
                    level: '',
                    name: move.move.name
                };
                tutorMoves.push(tutorMove);
            }
        });
        if (tutorMoves.length == 0) {
            return;
        } else {
            tutorMoves.sort(this.compareMoves);
            var moveRows = [];
            tutorMoves.map((tutorMove) => {
                moveRows.push(
                    <tr>
                        <td width="10%">{tutorMove.level}</td>
                        <td>{tutorMove.name}</td>
                    </tr>
                );
            });
            
            return (
                <div>
                    <h5>Tutor Moves</h5>
                    <Table>
                        <tbody>
                        {moveRows}
                        </tbody>
                    </Table>
                </div>
            );
        }
    }

    loadEggMoves(moves) {
        var eggMoves = [];
        moves.map((move) => {
            if (move.version_group_details[0].move_learn_method.name == 'egg') {
                var eggMove = {
                    level: '',
                    name: move.move.name
                };
                eggMoves.push(eggMove);
            }
        });
        if (eggMoves.length == 0) {
            return;
        } else {
            eggMoves.sort(this.compareMoves);
            var moveRows = [];
            eggMoves.map((eggMove) => {
                moveRows.push(
                    <tr>
                        <td width="10%">{eggMove.level}</td>
                        <td>{eggMove.name}</td>
                    </tr>
                );
            });
            
            return (
                <div>
                    <h5>Egg Moves</h5>
                    <Table>
                        <tbody>
                        {moveRows}
                        </tbody>
                    </Table>
                </div>
            );
        }
    }
    
    compareMoves(a,b) {
        if (a.level < b.level)
            return -1;
        else if (a.level > b.level)
            return 1;
        else if (a.level == b.level) {
            if (a.name < b.name)
                return -1;
            else if (a.name > b.name)
                return 1;
            else {
                return 0;
            }
        }
        return 0;
    }

    render() {
        const loader =
            <Row>
                <Col s={4} offset={'s4'}>
                    <ProgressBar/>
                </Col>
            </Row>;
        var items = [];
        self = this;
        this.state.pokemons.map((pokemon, i) => {
            items.push(
                <Col s={2}>
                    <Modal
                        header={capitalize.words(pokemon.name)}
                        trigger={
                                <Card header={<CardTitle image={pokemon.sprites.front_default} waves='light' />}
                                    title={capitalize.words(pokemon.name)}>
                                </Card>
                        }>
                        <Row>
                            <Col s={4}>
                                <img src={pokemon.sprites.front_default}/>
                            </Col>
                            <Col s={8}>
                                <Table>
                                    <tbody>
                                    <tr>
                                        <td colSpan={3}>
                                            {this.loadTypes(pokemon.types)}
                                        </td>
                                    </tr>
                                    {this.loadStats(pokemon.stats)}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row>
                            <Col s={12}>
                                <h4>Profile</h4>
                                <Table>
                                    <tbody>
                                    <tr>
                                        <td width="20%">Height:</td><td width="30%">{pokemon.height/10} m</td>
                                        <td width="20%">Weight:</td><td width="30%">{pokemon.weight/10} kg</td>
                                    </tr>
                                    <tr>
                                        <td width="20%">Abilities:</td><td width="30%">{this.loadAbilities(pokemon.abilities)}</td>
                                        <td width="20%">Base Experience:</td><td width="30%">{pokemon.base_experience}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row>
                            <Col s={12}>
                                <h4>Moves</h4>
                                {this.loadNaturalMoves(pokemon.moves)}
                                {this.loadMachineMoves(pokemon.moves)}
                                {this.loadTutorMoves(pokemon.moves)}
                                {this.loadEggMoves(pokemon.moves)}
                            </Col>
                        </Row>
                    </Modal>
                </Col>
            );
        });
        return (
            <div>
                <Row>
                    <Col s={3}/>
                    <Input type="text" placeholder="Search" s={6} onChange={this.handleChange} />
                </Row>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadItems.bind(this)}
                    hasMore={this.state.hasMoreItems}
                    threshold={100}
                    loader={loader}>

                    <Row>
                        {items}
                    </Row>
                </InfiniteScroll>
            </div>
        );
    }
}

export default PokemonList;