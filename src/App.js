import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import { Board } from './Board';

class App extends Component {
  game = null;
  appdiv= null;

  componentDidMount()
  {
     this.game.generate("ppplgggppppdddddllllgggpppppp");
  }

  render() {
    return (
      <div className="App" onKeyPress={(e)=> console.log(e)} >
        <Board ref={(t)=>{this.game=t;}} />
      </div>
    );
  }
}

export default App;
