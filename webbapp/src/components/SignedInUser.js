import { useEffect, useState } from 'react';
import { fetchData } from '../GET_request';
import { useAuth0 } from '@auth0/auth0-react';

function SignedInUser() {
  const { user } = useAuth0();
  const [dbUsers, setDbUsers] = useState([]);
  const [matchingUser, setMatchingUser] = useState(null);

  useEffect(() => {
    const fetchDataFromAPIusers = async () => {
      try {
        const result = await fetchData('user');
        setDbUsers(result.data);

        if (user) {
          const userFromDatabase = dbUsers.find(dbUser => dbUser.auth_id === user.sub);
          if (userFromDatabase) {
            setMatchingUser(userFromDatabase);
          } else {
            setMatchingUser(null);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataFromAPIusers();
  }, [user, dbUsers]);

  return matchingUser;
}

export default SignedInUser;
