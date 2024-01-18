import { useEffect } from 'react';
import { fetchData } from '../GET_request';
import { postData } from '../POST_request';
import { useAuth0 } from "@auth0/auth0-react";

const CheckNewUser = () => {
  const { user } = useAuth0();

  useEffect(() => {
    const fetchDataFromAPIusers = async () => {
      const result = await fetchData('user');
      const dbUsers = result.data;

      if (user) {
        const sendDataToServer = async () => {
          const endpoint = 'user';
          const auth_id = user.sub

          const body = {
            "first_name": "",
            "last_name": "",
            "status": "Active",
            "role": "ppu",
            "credit_amount": 0,
            "phone_number": "",
            "email": `${user.email}`,
            "auth_id":`${auth_id}`
          };

          await postData(endpoint, body);
        }

        const userExistsInDatabase = dbUsers.some(dbUser => dbUser.email === user.email);

        if (!userExistsInDatabase) {
          sendDataToServer(); // Ny användare => Skapa user i Databas
        }
      }
    };

    fetchDataFromAPIusers();
  }, [user]);

};

export default CheckNewUser;
