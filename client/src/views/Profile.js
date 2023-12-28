import React from "react";
import { Container, Row, Col } from "reactstrap";
import Loading from "../components/Loading";

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import SignedInUser from "../components/SignedInUser";

export const ProfileComponent = () => {
  const { user } = useAuth0();
  const dbuser = SignedInUser()
  console.log(dbuser.role)

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
          <h2>{user.name}</h2>
          <p className="lead text-muted">{user.email}</p>
          <p className="lead text-muted">Roll: {dbuser.role}</p>
        </Col>
      </Row>
      <Row>
      </Row>
    </Container>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
