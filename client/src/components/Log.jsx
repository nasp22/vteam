import React from "react";
import { Container, Row, Col } from "reactstrap";
import { useAuth0 } from "@auth0/auth0-react";
import SignedInUser from "./SignedInUser";

const Log = () => {
  const { user } = useAuth0();
  const loggedInUser = SignedInUser();

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
          <h2>Logg</h2>
          <p>{loggedInUser.log}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Log
