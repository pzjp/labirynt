import React, { Component } from "react";
import './App.css';

class InfoWindow extends Component {
  render() {
    return (
      <div>
        <h2>O grze</h2>
        <p>Gra Labirynt jest bardzo prosta w swojej istocie. Chodzi o to, aby
            przejść przez wszystkie pola stając na każdym dokładnie tyle razy,
            ile wskazuje podana na polu liczba.</p><p>
            Klikając myszą możemy przesuwać się na sąsiednie kwadratowe pola.
            Kliknicie na pole bardziej odległe (ale znajdujące się w tym samym wierszu/kolumnie)
            przechodzimy od razu kilka kolejnych pól.</p>
      </div>
    );
  }
}
 
export default InfoWindow;