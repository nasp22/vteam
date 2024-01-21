import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import '../style/Info.css'

const Info = () => {

  return (
    <div className="info-container">
      <div className="info-divs">
        <h4 id="1">On-The-Go eller månadsprenumerant?</h4>
          <p>Du har två val som användare. Alternativ ett är att vara en enkel On-The-Go användare där du betalar efter varje avslutad resa, precis som vanligt. Skulle du vilja bli månadsprenumerant betalar du en fast summa på 99 kr varje månad vilket ger dig fri tillgång till alla våra el-scootrar.</p>
      </div>
      <div className="info-divs">
        <h4 id="2">Såhär fungerar det!</h4>
          <p>Efter att ha skapat ett konto kan du både logga in i vår app och på din egna sida. För att kunna hyra en el-scooter behöver du sätta in pengar vilket du enkelt gör i din egna sida via fliken Saldo. När pengarna är inne är det fritt fram att hyra din första el-scooter. Gå in i appen, hyr önskad el-scooter och påbörja din resa. När du är klar avslutar du din resa och du blir tilldelad en uthyrningsavgift som dras från ditt saldo. Tänk på att du kan komma billigare undan om du parkerar inom våra gröna zoner!</p>
      </div>
      <div className="info-divs">
        <h4 id="3">Om oss</h4>
          <p>Vi är Team Kaschang. Vi föddes i Sverige, där massor av smarta människor, företag och kända idéer kommer från. Redan från start har vi trott på frihet. Vi tror på städer där människorna kan röra sig fritt och på sina egna villkor. Utan vare sig trängsel, motorbuller eller luftföroreningar. Vi gör städer för människor. Det betyder att vi gör allt för att du ska kunna ta dig till och från jobbet, bridgeklubben, skolan eller var du nu brukar hänga - i tystnad och utan fossila bränslen. Vi vill att du ska uppleva din egen stad, eller en helt ny, på ett roligt sätt. Så hoppa på och ta en åktur!</p>
      </div>
      <div className="info-divs">
        <h4 id="4">Kontakta oss</h4>
          <p>
            <FontAwesomeIcon className="info-fa-icon" icon={faEnvelope} /> admin@vteam.se
          </p>
          <p>
            <FontAwesomeIcon className="info-fa-icon" icon={faPhone} /> +123456789
          </p>
          <p>
            <FontAwesomeIcon  className="info-fa-icon" icon={faMapMarkerAlt} /> Scootergatan 193, 999 99 Scooterville
          </p>
      </div>
    </div>
  );
};

export default Info
