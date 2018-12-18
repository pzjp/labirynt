import React, { Component } from 'react';
import {Route, HashRouter } from "react-router-dom";
import PlayWindow from "./pages/PlayWindow";
import InfoWindow from "./pages/InfoWindow";
import LogWindow from "./pages/LogWindow";
import StatWindow from "./pages/StatWindow";
import MainMenu from "./Menu";
import Home from "./pages/Void";
import './App.css';

class App extends Component {
  
  menu ;
  
  render() {
    if (this.menu) this.menu.hideMenu();

    return (<HashRouter>

      <div className="App"  /* onKeyPress={(e)=> console.log(e)} > */ >
        <MainMenu ref={ obj => this.menu= obj } />
        <div className="App-header"><h1>Labirynt</h1>
        <p>Gra logiczna</p></div>
        <div className="App-body">
            <Route exact path="/" component={Home} />
            <Route path="/gra" component={PlayWindow} />
            <Route path="/login" component={LogWindow} />
            <Route path="/info" component={InfoWindow} />
            <Route path="/stat" component={StatWindow} />
        </div>
      </div>

      </HashRouter>);
  }
}

export default App;
