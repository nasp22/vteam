import React, { Fragment } from "react";
import Profile from "../components/Profile.jsx";
import Hero from "../components/Hero.jsx";
import { withAuthenticationRequired } from "@auth0/auth0-react";

const Home = () => (

  <Fragment>
    <Hero/>
    <Profile/>
  </Fragment>
);

export default withAuthenticationRequired(Home);