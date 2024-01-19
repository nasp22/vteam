import React from "react";
import logo from "../assets/logo.png";
import { useAuth0 } from "@auth0/auth0-react";
import SignedInUser from "./SignedInUser";
import MapComponentCities from "./MapComponentCities";

const Hero = () => {

  const {
    user,
    isAuthenticated
  } = useAuth0();

  const userDB = SignedInUser()
  return (
    <>
    <div className="Hero">
          {isAuthenticated && userDB.role !== "admin" && (
            <div>
              Välkommen, User!
            </div>
          )}
          {isAuthenticated && userDB.role === "admin" && (
            <div>
              <h1> Välkommen Admin! </h1>
              <MapComponentCities/>
            </div>
          )}
          {!isAuthenticated && (
          <div className="text-center hero my-5">
            <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />
              <h1 className="mb-4">Vteam Project</h1>
            <h3>Startsidan</h3>
        </div>
          )}
    </div>
    </>
  );
};

export default Hero;
