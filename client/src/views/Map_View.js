import MapComponent from '../components/MapComponentStations';
import 'leaflet/dist/leaflet.css';

const Map_View = () => {
    return (
      <div>
        <h1>Karta som visar städer med stationer </h1>
        <p>klicka på staden för att välja</p>
        <MapComponent/>
      </div>
    );
  };

  export default Map_View;