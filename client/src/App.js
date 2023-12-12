import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import Map_City_View from "./views/Map_City_View";
import API_View from "./components/Show_API"
import Users_View from "./views/Users_View";
import Stations_View from "./views/Stations_View";
import Scooters_View from "./views/Scooters_View";
import CityDetailsView from './views/CityDetailsView';
import MapComponentCities from './components/MapComponentCities';

import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Profile from "./views/Profile";
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";
import 'leaflet/dist/leaflet.css';

// styles
import "./App.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";

initFontAwesome();


const App = () => {
  const { isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <NavBar/>
        <Container className="flex-grow-1 mt-5">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/API" component={API_View} />
            <Route path="/map" component={Map_City_View} />
            <Route path="/users" component={Users_View} />
            <Route path="/stations" component={Stations_View} />
            <Route path="/scooters" component={Scooters_View} />
            <Route path="/" exact component={MapComponentCities} />
            <Route path="/city-details/:id" component={CityDetailsView} />
          </Switch>
        </Container>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
