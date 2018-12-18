import React, { Component } from 'react';
import { NavLink } from "react-router-dom";

//import logo from './logo.svg';
import './App.css';


class Menu extends Component {

  state={ style: {display:"none"} };

  showMenu(e)
  {
    if (this.state.style.display==="none")
      this.setState( {style: {display:"block"} });
    else
      this.setState( {style: {display:"none"} });
    e.preventDefault();
  }

  hideMenu()
  {
    this.setState( {style: {display:"none"} });
  }

  componentDidMount() {
    console.log("Add event listener!");
    document.body.addEventListener("click",e => {
      if (e.srcElement.className!=="TopMenu") this.hideMenu();
    });
  }

  render()
  {
    /* if (this.x) {this.x=false; console.log("Add event listener!");
    document.body.addEventListener("click",e => {
      if (e.srcElement.className!=="TopMenu") this.hideMenu();
    }); } */
    return (<div>
      <div className="btn btn-default TopMenu" onClick={e => this.showMenu(e)}>Menu</div>
      <div className="Menu" id="menu" style={this.state.style} >
        <div className="item"><NavLink to="/gra"  >Graj</NavLink></div>
        <div></div>
        <div className="item"><NavLink to="/login">Zaloguj się</NavLink></div>
        <div className="item"><NavLink to="/stat" >Statystyki</NavLink></div>
        <div className="item"><NavLink to="/info" >Informacja</NavLink></div>
      </div>
      </div>);
  }
}

export default Menu;
