import React, { Component } from 'react';
import "./App.css";

export class Board extends Component {
  boardWidth = 20;
  boardHeight = 11;

  zeros()
  {
    let x, y;
    var values = [];
    for (x = 0; x < this.boardWidth; x++) {
      values[x] = [];
      for (y = 0; y < this.boardHeight; y++)
        values[x][y] = 0;
    }
    return values;
  }

  state = { x: 0, y: 0, cells: this.zeros(), count: 0 };

  generate(path) {
    var x, y, i;
    var values = this.zeros();
    x = 0;
    y = 5;
    for (i = 0; i < path.length; i++) {
      ++(values[x][y]);
      switch (path.charAt(i)) {
        case 'g': y--; break;
        case 'd': y++; break;
        case 'l': x--; break;
        case 'p': x++; break;
        default: console.log("Invalid level definition!");
      }
    }
    this.setState({ x: 0, y: 5, cells: values, count: path.length });
    console.log("Board reloaded.");
  }

  getPointHandler(x,y)
  {
      const game = this;
      return function(e)
      {
        e.preventDefault();
        //console.log('Kliknięcie! ('+x+','+y+')');
        if (x!== game.state.x && y !== game.state.y) return;
        var dx = Math.sign(x-game.state.x);
        var dy = Math.sign(y-game.state.y);
        let i, x2=x, y2=y;
        let board= JSON.parse(JSON.stringify(game.state.cells));
        let count = game.state.count;
        if ( dx )
        for(i=game.state.x; i!== x; i+=dx)
        {
            //console.log(i+' '+y);
            if (board[i+dx][y] > 0)
            {
                --board[i][y];
                --count;
            }
            else
            {
                x2=i;
                break;
            }
        }
        else   
        for(i=game.state.y; i!== y; i+=dy)
        {  
           //console.log(x+' '+i);
           if (board[x][i+dy] > 0)
           {
               --board[x][i];
               --count;
           }
           else
           {
               y2=i;
               break;
           }
        }
        game.setState({x: x2, y: y2, cells: board, count: count});     
      };
  }

  oneStep(dx,dy)
  {
      var board = this.state.cells;
      if ( board[this.state.x+dx][this.state.y+dy] <= 0) return false;
      --(board[this.state.x][this.state.y]);
      this.setState({   x:this.state.x+dx,
                        y: this.state.y+dy,
                        cells: board,
                        count: this.state.count-1});
      return true;
  }

  keyHandler(event)
  {
    console.log(event);
    switch (event.key)
    {
        case 'ArrowDown':  event.preventDefault(); this.oneStep(0,1);  break;
        case 'ArrowUp':    event.preventDefault(); this.oneStep(0,-1); break;
        case 'ArrowLeft':  event.preventDefault(); this.oneStep(-1,0); break;
        case 'ArrowRight': event.preventDefault(); this.oneStep(1,0);  break;
    }
  };

  render() {
    var cells = [];
    let x, y;
    for (y = 0; y < this.boardHeight; y++) {
      for (x = 0; x < this.boardWidth; x++) {
      //  let handler = function (e) { e.preventDefault(); };
        let level = this.state.cells[x][y];
        if (x === this.state.x && y === this.state.y)
          level = -level;
        cells = [...cells, (<Cell x={x} y={y} level={level} handler={this.getPointHandler(x,y)} />)];
      }
      cells = [...cells, (<div className="newline"></div>)];
    }

    return (<div className="Game-Board" onKeyDown={this.keyHandler}>
      {cells}
    </div>);
  }
}

function Cell({ x, y, level, handler })
{
  var klasa = "Game-cell";
  var label = '' + level;
  if (level === 0)
  {
    label = ''; handler = null;
    klasa = "Game-void";
  }
  else if (level < 0)
  {
    klasa += " active";
    label = '' + (-level);
  }
  return (<div className={klasa} onClick={handler} key={x + ' ' + y}>{label}</div>);
};