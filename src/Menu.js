import React, { Component } from 'react';
import { NavLink } from "react-router-dom";

//import logo from './logo.svg';
import './App.css';

class Menu extends Component {

  state={ style: {display:"none"} };

  showMenu(e)
  {
    this.setState( {style: {display:"block"} });
    e.preventDefault();
  }

  hideMenu()
  {
    this.setState( {style: {display:"none"} });
  }

  render()
  {
    return (<div>
      <div className="TopMenu" onClick={e => this.showMenu(e)}>Menu</div>
      <div className="Menu" id="menu" style={this.state.style} >
        <div className="item"><NavLink to="/gra">Graj</NavLink></div>
        <div className="item"><NavLink to="/login">Zaloguj się</NavLink></div>
        <div className="item"><NavLink to="/stat">Statystyki</NavLink></div>
        <div className="item"><NavLink to="/info">Informacja</NavLink></div>
      </div>
      </div>);
  }
}

export default Menu;
