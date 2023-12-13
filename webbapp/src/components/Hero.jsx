import logo from "../assets/logo.png";
import { useAuth0 } from "@auth0/auth0-react";

const Hero = () => {

  const {
    isAuthenticated
  } = useAuth0();

  return (
    <>
    <div className="Hero">
          {!isAuthenticated && (
          <div className="text-center hero my-5">
            <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />
        </div>
          )}
    </div>
    </>
  );
};

export default Hero;
