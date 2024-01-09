import React, { Fragment } from "react";
import Hero from "../components/Hero.jsx";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import CurrentRental from "../components/CurrentRental.jsx";
const Home = () => (

  <Fragment>
    <Hero/>
    <CurrentRental/>
  </Fragment>
);

export default withAuthenticationRequired(Home);
