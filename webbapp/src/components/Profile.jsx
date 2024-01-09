import { useAuth0 } from "@auth0/auth0-react";
import SignedInUser from "./SignedInUser";


const Profile = () => {
  const user_signedIn = SignedInUser()
  const {
    isAuthenticated
  } = useAuth0();

  return (
    <>
    <div className="Profile">
          {!isAuthenticated && (
          <div className="text-center Start">
            {console.log(user_signedIn.first_name)}
          </div>
          )}
    </div>
    </>
  );
};

export default Profile;
