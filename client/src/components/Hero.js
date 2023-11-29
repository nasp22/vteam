import React from "react";
import logo from "../assets/logo.png";

const Hero = () => (
  <div className="text-center hero my-5">
    <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />
    <h1 className="mb-4">Vteam Project</h1>

    <p className="lead">
      <a>Startsidan</a>
    </p>
  </div>
);

export default Hero;
