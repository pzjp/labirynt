import React, { Component } from 'react';
import {Route, HashRouter } from "react-router-dom";
import PlayWindow from "./PlayWindow";
import InfoWindow from "./InfoWindow";
import LogWindow from "./LogWindow";
import StatWindow from "./StatWindow";
import MainMenu from "./Menu";
import './App.css';

class App extends Component {
  
  menu = null;
  
  render() {
    if (this.menu) this.menu.hideMenu();

    return (<HashRouter onClick={e => this.menu.hideMenu()} >

      <div className="App" onKeyPress={(e)=> console.log(e)} >
        <MainMenu ref={ obj => this.menu= obj } />
        <div className="App-header"><h1>Labirynt</h1>
        <p>Gra logiczna</p></div>
        <div className="App-body">
            <Route exact path="/login" component={LogWindow}/>
            <Route path="/info" component={InfoWindow}/>
            <Route path="/gra" component={PlayWindow}/>
            <Route path="/stat" component={StatWindow}/>
         </div>
      </div>

      </HashRouter>);
  }
}

export default App;
