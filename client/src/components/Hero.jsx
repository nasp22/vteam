import logo from "../assets/logo.png";

import { useAuth0 } from "@auth0/auth0-react";

const Hero = () => {

  const {
    user,
    isAuthenticated
  } = useAuth0();

  return (
    <>
    <div>
          {isAuthenticated && user.name === "user@vteam.se" && (
            <div>
              Välkommen, User!
            </div>
          )}
          {isAuthenticated && user.name === "admin@vteam.se" && (
            <div>
              Välkommen, Admin!
            </div>
          )}
          {!isAuthenticated && (
          <div className="text-center hero my-5">
            <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />
              <h1 className="mb-4">Vteam Project</h1>
            <h3>Startsidan</h3>
            <h2>EJ inloggad</h2>
        </div>
          )}
    </div>
    </>
  );
};

export default Hero;
