import React, { Component } from 'react';
import "./Board.css";

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

  state = { x: -1, y: -1, cells: this.zeros(), count: 0,
    path: '', clicks: 0 };

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
    this.setState({ x: 0, y: 5, cells: values, count: path.length, path:'', clicks:0 });
    //console.log("Board reloaded.");
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
        let path= game.state.path;
        let klik= 0;
        if ( dx )
          for(i=game.state.x; i!== x; i+=dx)
          {
              //console.log(i+' '+y);
              if (board[i+dx][y] > 0)
              {
                  --board[i][y]; --count;
                  if(dx>0) path+='p'; else path+='l';
                  klik=1;
              }
              else { x2=i; break; } // Niemożliwy ruch!
          }
        else   
          for(i=game.state.y; i!== y; i+=dy)
          {  
            //console.log(x+' '+i);
            if (board[x][i+dy] > 0)
            {
                --board[x][i]; --count;
                if(dy>0) path+='d'; else path+='g';
                klik=1;
            }
            else { y2=i; break; } // Niemożliwy ruch!
          }
        game.setState({x: x2, y: y2, cells: board,
          count: count, path:path, clicks: game.state.clicks+klik });     
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
        default:
    }
  };

  render() {
    var cells = [];
    let x, y;
    let win='none';
    for (y = 0; y < this.boardHeight; y++)
    {
      //let row=[];
      for (x = 0; x < this.boardWidth; x++)
      {
        let level = this.state.cells[x][y];
        let active='';
        if (x === this.state.x && y === this.state.y)
        {
          if (this.state.count===1)
          {
            win='block';
            level=0;
            active=' victory';
          }
          else active=' active';
        }

        cells = [...cells, (<Cell className={active} level={level}
          key={x + ' ' + y} handler={this.getPointHandler(x,y)} />)];
      }
      cells = [...cells, (<div className="newline" key={"nl"+y} />)];
    }

    return (<div>
      <div className="Game-Board">{cells}</div>
      <div style={{display:win}} className="VictoryPanel">
      Plansza ukończona!
      <div>Liczba ruchów: <b>{this.state.clicks}</b></div>
      <div>Twoje rozwiązanie:<br/><b>{this.state.path}</b></div>
      </div>
    </div>);
  }
}

const colorSeq=
[ "#556655","#007700","#008800","#109910","#00AA00","#00BB00","#00CC00","#00DD00","#10DE10","#00FF00"]
//['EE','CC','AA','99','88','77','66','55', '44','40','36','30','28','20','1A','16','10'];

function Cell({className, level, handler })
{
  let klasa = "Game-cell"+className;
  let label = '' + level;
  if (level === 0)
  {
    label = ' '; handler = null;
    klasa = "Game-void";
  }
  let styl= { backgroundColor: colorSeq[level] };
  if (className) { styl={}; klasa="Game-cell"+className; }

  return (<div className={klasa} style={styl} onClick={handler}>{label}</div>);
};