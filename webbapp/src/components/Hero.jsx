import { useAuth0 } from "@auth0/auth0-react";

const Hero = () => {

  const {
    isAuthenticated
  } = useAuth0();

  return (
    <>
    <div className="Hero">
          {!isAuthenticated && (
          <div className="text-center Start">
          </div>
          )}
    </div>
    </>
  );
};

export default Hero;
