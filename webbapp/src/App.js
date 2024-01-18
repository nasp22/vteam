import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Home from "./views/Home";
import Rent_view from "./views/Rent_view";
import Profile_view from "./views/Profil_view";
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";
import 'leaflet/dist/leaflet.css';
import CurrentRent_view from "./views/CurrentRent_view";
import {fetchData} from "./GET_request.js"

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
      <NavBar className="NavBar"/>
        <Container className="flex-grow-1 mt-5">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={Profile_view} />
            <Route path="/rent/:scooterId" component={Rent_view} />
            <Route path="/rent" component={CurrentRent_view} />
          </Switch>
        </Container>
      </div>
    </Router>
  );
};

export default App;
