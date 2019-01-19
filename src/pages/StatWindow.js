import React, { Component } from "react";
import axios from "axios";
import ReactTable from "react-table";
import 'react-table/react-table.css'
//import '../App.css';
 
class StatWindow extends Component
{
  header1 =[
    { Header: "Plansza", accessor: 'id', resizable: false, width: 70 },
    { Header: "Znanych rozwiązań", accessor: 'solutions' },
    { Header: "Min. liczba ruchów", accessor: 'moves' ,
        Cell: el => <span className="number">{el.value}</span>},
    { Header: "Liczba graczy",  accessor: "players" }
    //{ Header: "Średnio ruchów", id: "mean", accessor: (el => el.moves) },
  ];
  header2 =[
    { Header: "Plansza", accessor: 'id', resizable: false, width: 70 },
    { Header: "Ukończona", id: "solved", accessor: (el => {
      if (el.player.solved) return "tak";
      else return "nie";}) },
    { Header: "Min. liczba ruchów", accessor: 'player.moves' ,
        Cell: el => <span className="number">{el.value}</span>},
  ];
  state= {data :[], username: null};

  componentDidMount()
  {
    // Ładowanie statystyk
    axios.get('/stats.json').then( res=> {
      this.setState({data: res.data.stats, username: res.data.user});
    });
  }

  render()
  {
    var user_stats;
    if (this.state.username)
    {
      user_stats= (<div>
          <h3>Twoje wyniki ({this.state.username})</h3>
          <ReactTable defaultPageSize={10} columns={this.header2} data={this.state.data}
           previousText='Poprzednia'
           nextText='Następna'
           loadingText='Czekaj...'
           // noDataText='Brak danych'
           pageText='Strona'
           ofText='z'
           rowsText='wierszy' />
        </div>);
    }
    else
    user_stats=(<div><a href="/#/login">Zaloguj się</a> aby zobaczyć swoje wyniki.</div>);
    
    return (
      <div>
        <h2>Statystyki</h2>
        <div>
          <h3>Ogólne informacje o planszach</h3>
          <ReactTable defaultPageSize={10} columns={this.header1} data={this.state.data}
           previousText='Poprzednia' nextText='Następna'
           loadingText='Czekaj...' className="-striped -highlight"
           // noDataText='Brak danych'
           pageText='Strona' ofText='z' rowsText='wierszy' />
        </div>
        {user_stats}
      </div>
    );
  }
}
 
export default StatWindow;