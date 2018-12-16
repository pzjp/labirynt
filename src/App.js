import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import { Board } from './Board';
import Plansze from './plansze';

class App extends Component {
  game = null;
  //appdiv= null;
  state={ plansza: null };
  /* 
  componentDidMount()
  {
     this.game.generate("ppplgggppppdddddllllgggpppppp");
  } */

  render() {
    var levels= Plansze.map((p)=> { let klasa='';
      if (p.id===this.state.plansza) klasa="active";
      return (
      <div key={"Menu,"+p.id} className={klasa} onClick={(e)=> {
        this.game.generate(p.answer); this.setState({plansza:p.id}); }}>Plansza {p.id}</div>
    )} );
    return (
      <div className="App" onKeyPress={(e)=> console.log(e)} >
        <div className="App-header"><h1>Labirynt</h1>
        <p>Gra logiczna</p></div>
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

export default App;
