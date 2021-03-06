import React, { Component } from 'react';
//import logo from './logo.svg';
import '../App.css';
import { Board } from './Board';
//import Plansze from '../plansze';
import axios from "axios";

class PlayWindow extends Component {
  game = null;
  state={ plansza: null };
  Plansze = [];

  componentDidMount()
  {
    axios.get('/plansze.json').then( res=> {
      this.Plansze = res.data.table;
      //console.log("Wczytano plansze.");
         this.setState(this.state);
      });
  }

  render() {
    const levels = this.Plansze.map((p)=> {
            let klasa='btn ';
            if (p.solved) klasa+="btn-success";
            else klasa+="btn-primary";
            if (p.id===this.state.plansza) klasa+=" active";
          return (
          <div key={"Menu,"+p.id} className={klasa} onClick={(e)=> {
            this.game.generate(p.answer,p.id);
            this.setState({plansza:p.id});
          }}>Plansza {p.id}</div>
        )} );
    const me = this;
    return (
      <div>
        <div className="App-body">
          <div className="levelList scrollbar scrollbar-primary">
            {levels}
          </div>
        <Board ref={(t)=>{this.game=t;}} callback={function(){me.componentDidMount()}} />
        </div>
      </div>
    );
  }
}

export default PlayWindow;
