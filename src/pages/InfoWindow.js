import React, { Component } from "react";
import '../App.css';

class InfoWindow extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div id="info-rules">
        <h2>Zasady gry</h2>
        <p>Gra Labirynt jest bardzo prosta w swojej istocie. Celem gracza jest
            przejście przez wszystkie pola, stając na każdym dokładnie tyle razy,
            ile wskazuje podana na polu liczba.</p>
        <p>Klikając myszą możemy przesuwać się na sąsiednie kwadratowe pola.
            Klikając na pole bardziej odległe (ale znajdujące się w tym samym wierszu/kolumnie)
            przechodzimy od razu o kilka kolejnych pól. Warto z tego korzystać, gdyż
            pozwala ograniczyć liczbę ruchów.</p>
            <div className="img-info" >
              <img src="img1.png" className="img-circle img-info"
              alt="Przed kliknięciem"/>
              <img src="img2.png" className="img-circle img-info"
              alt="Po kliknięciu"/>
            </div>
        </div>
        <div id="info-stats">
        <h2>Statystyki</h2>
        <p>W statystykach gry gromadzone są następujące informacje:</p>
        <ul>
          <li>Minimalna liczba ruchów, w jakiej udało się ukończyć planszę.</li>
          <li>Liczba dotychczas odkrytych ścieżek pozwalających ukończyć planszę.</li>
          <li>Liczba graczy, którym udało się ukończyc planszę.</li>
        </ul>
        <p>W statystykach nie są uwzględniani niezalogowani użytkownicy. Nie mają
          oni także możliwości przekonać się, czy odkryli nowe rozwiąznie którejś z plansz.
        </p>
        </div>

        <hr/>
        <h3>O projekcie</h3>
            <p>Autor: Piotr Pikul</p>
            <p>Grudzień 2018 / Styczeń 2019</p>
      </div>
    );
  }
}
 
export default InfoWindow;