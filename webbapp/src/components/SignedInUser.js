import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchData } from '../GET_request';

function SignedInUser() {
  const { user } = useAuth0();
  const [loggedInUser, setLoggedInUser] = useState([]);

  useEffect(() => {

    const fetchDataFromAPILoggedInUser = async () => {
      try {
        const result = await fetchData(`user/${user.sub}`);
        setLoggedInUser(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataFromAPILoggedInUser();

    const intervalId = setInterval(fetchDataFromAPILoggedInUser, 1000);
    return () => clearInterval(intervalId);
  }, [user]);

  return loggedInUser;
}

export default SignedInUser;