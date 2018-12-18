import React, { Component } from "react";
//import '../App.css';
 
class LogWindow extends Component {
  state={ command:"Zaloguj się" };

  render() {
    return (
      <div>
        <h2>Logowanie</h2>
        <p>TODO.</p>
        <form id="userdata">
          <div className="form-group"> 
            <input type="checkbox" id="register" className="form-check-input"
            onChange={e => {
              if (e.target.checked)
                this.setState({command:"Załóż konto"});
              else
                this.setState({command:"Zaloguj się"}); 
                }}
            ></input>
            <label htmlFor="register">Nie mam konta</label>
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Login</label>
            <input className="form-control" id="username"></input>
          </div>
          <div className="form-group">
            <label htmlFor="pass">Hasło</label>
            <input type="password" className="form-control" id="pass"></input>
          </div>
          
          <input type="submit" className="btn" formMethod="post" value={this.state.command} />
        </form>
      </div>
    );
  }
}
 
export default LogWindow;