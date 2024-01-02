import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import Map_City_View from "./views/Map_City_View";
import Map_Cities_View from "./views/Map_Cities_View";
import Users_View from "./views/Users_View";
import Stations_View from "./views/Stations_View";
import Scooters_View from "./views/Scooters_View";

import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import BackButton from "./components/BackButton";
import Home from "./views/Home";
import Profile_View from "./views/Profile_View";
import Balance_View from "./views/Balance_View";
import Deposit_View from "./views/Deposit_View";
import Update_Profile_View from "./views/Update_Profile_View";
import Log_View from "./views/Log_View";
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
        <BackButton />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={Profile_View} />
            <Route path="/balance" component={Balance_View} />
            <Route path="/deposit" component={Deposit_View} />
            <Route path="/update_profile" component={Update_Profile_View} />
            <Route path="/log" component={Log_View} />
            <Route path="/city/:id" component={Map_City_View} />
            <Route path="/map" component={Map_Cities_View} />
            <Route path="/users" component={Users_View} />
            <Route path="/stations" component={Stations_View} />
            <Route path="/stations/:stationId"/>
            <Route path="/scooters" component={Scooters_View} />
            <Route path="/scooters/:scooterId"/>
          </Switch>
        </Container>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
