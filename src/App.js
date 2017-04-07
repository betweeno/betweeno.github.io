import React, { Component } from 'react';
import './assets/scss/common.scss'

import Nav from './components/Nav'
import Header from './components/Header'

export default class App extends Component {
  render() {
    return (
      <div id="app">
        <Nav />
        <Header></Header>
        <h1>Hello World</h1>
      </div>
    );
  }
}
