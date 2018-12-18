import React, { Component } from "react";
//import './App.css';

class InfoWindow extends Component {
  render() {
    return (
      <div className="container-fluid">
        <h2>Zasady gry</h2>
        <p>Gra Labirynt jest bardzo prosta w swojej istocie. Chodzi o to, aby
            przejść przez wszystkie pola stając na każdym dokładnie tyle razy,
            ile wskazuje podana na polu liczba.</p>
        <p>Klikając myszą możemy przesuwać się na sąsiednie kwadratowe pola.
            Klikając na pole bardziej odległe (ale znajdujące się w tym samym wierszu/kolumnie)
            przechodzimy od razu o kilka kolejnych pól. Warto z tego korzystać, gdyż
            pozwala ograniczyć liczbę ruchów.</p>

        <h3>O projekcie</h3>
            <p>Autor: Piotr Pikul</p>
            <p>Grudzień 2018</p>
      </div>
    );
  }
}
 
export default InfoWindow;