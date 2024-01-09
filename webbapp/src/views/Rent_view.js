import React, { Fragment } from "react";
import Rental from "../components/Rental.jsx";
import Hero from "../components/Hero.jsx";
import { withAuthenticationRequired } from "@auth0/auth0-react";
const Home = () => (

  <Fragment>
    <Hero/>
    <Rental/>
  </Fragment>
);

export default withAuthenticationRequired(Home);
