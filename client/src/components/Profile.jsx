import React from "react";
import { Link } from 'react-router-dom';
import { Container, Row, Col } from "reactstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { delData } from '../DEL_request';
import { delUserAuth0 } from '../DEL_request'
import SignedInUser from "./SignedInUser";
import '../style/Profile.css'
import '../style/Buttons.css'

const Profile = () => {
  const { user, logout } = useAuth0();
  const loggedInUser = SignedInUser()

  const logoutWithRedirect = () =>
  logout({
      logoutParams: {
        returnTo: window.location.origin,
      }
  });

  const handleDeleteProfile = async () => {
    const isConfirmed = window.confirm('Är du säker på ditt val?');

    if (isConfirmed) {
      await delData('user', loggedInUser._id);
      await delUserAuth0(user.sub)
      logoutWithRedirect()
    }
  };

  return (
    <Container className="mb-5">
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={2}>
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </Col>
        <Col md>
          <h2 className="profile-name">{loggedInUser.first_name} {loggedInUser.last_name} </h2>
          <p className="lead text-muted profile-text">Email: {loggedInUser.email}</p>
          <p className="lead text-muted profile-text">Telefonnummer: {loggedInUser.phone_number}</p>
          <p className="lead text-muted profile-text">Roll: {loggedInUser.role}</p>
          <Link to="/update_profile">
            <button className="blue-button">Ändra</button>
          </Link>
            <button onClick={handleDeleteProfile} className="red-button">Radera profil</button>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
