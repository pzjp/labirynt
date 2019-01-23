import React, { Component } from 'react';
import {Route, HashRouter } from "react-router-dom";
import PlayWindow from "./pages/PlayWindow";
import InfoWindow from "./pages/InfoWindow";
import LogWindow from "./pages/LogWindow";
import StatWindow from "./pages/StatWindow";
import MainMenu from "./Menu";
import Home from "./pages/Void";
//import Lget from 'lodash/get';

import './App.css';
import Axios from 'axios';

class App extends Component {
  
  menu ;
  state={username:null,admin:false};

  componentDidMount()
  {
    this.getUsername();
  }

  getUsername()
  {
    Axios.get('/api/username').then(res =>{
      this.setState({username: res.data.username, admin : (res.data.type=='admin')});
    });
  }
  
  render() {
    if (this.menu) this.menu.hideMenu();
    //const {userObj} = this.props;
    var logOutBtn= ('');
    //console.log(JSON.stringify(userObj));
    //console.log(Lget(userObj, 'isAuthenticated'));
    if ( this.state.username )
    {
        //Lget(userObj, 'loggedUserObj.userName');
        logOutBtn=(<div id="logout" className="btn btn-default" onClick={
          (evt)=>{ Axios.get("/api/logout");   // Zdarzenie
            this.menu.props.adminMode=true;
            this.setState({username:null,admin:false}); } }>
          Wyloguj ({this.state.username}) <span className="glyphicon glyphicon-log-out"></span></div>);
    }
    return (<HashRouter>

      <div className="App"  /* onKeyPress={(e)=> console.log(e)} > */ >
        <MainMenu ref={ obj => this.menu= obj } adminMode={this.state.admin} />
        {logOutBtn}
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
