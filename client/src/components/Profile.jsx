import React from "react";
import { Link } from 'react-router-dom';
import { Container, Row, Col } from "reactstrap";
import Loading from "./Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import SignedInUser from "./SignedInUser";

const Profile = () => {
  const { user } = useAuth0();
  const loggedInUser = SignedInUser();
  console.log(user);
  console.log(loggedInUser);


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
          <h2>{loggedInUser.first_name} {loggedInUser.last_name} </h2>
          <p className="lead text-muted">{loggedInUser.email}</p>
          <p className="lead text-muted">{loggedInUser.phone_number}</p>
          <p className="lead text-muted">{loggedInUser.role}</p>
          <Link to="/update_profile">
            <button>Ändra information</button>
          </Link>
        </Col>
      </Row>
      <Row>
      </Row>
    </Container>
  );
};

export default withAuthenticationRequired(Profile, {
  onRedirecting: () => <Loading />,
});
