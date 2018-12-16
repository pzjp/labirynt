import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import { Board } from './Board';
import Plansze from './plansze';

class PlayWindow extends Component {
  game = null;
  state={ plansza: null };

  render() {
    var levels= Plansze.map((p)=> { let klasa='';
      if (p.id===this.state.plansza) klasa="active";
      return (
      <div key={"Menu,"+p.id} className={klasa} onClick={(e)=> {
        this.game.generate(p.answer); this.setState({plansza:p.id}); }}>Plansza {p.id}</div>
    )} );
    return (
      <div>
        <div className="levelList">
          {levels}
        </div>
        <div className="App-body">
        <Board ref={(t)=>{this.game=t;}} />
        </div>
      </div>
    );
  }
}

export default PlayWindow;
