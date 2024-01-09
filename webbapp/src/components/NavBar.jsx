import React, { useState } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SignedInUser from "./SignedInUser";

import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  Button,
  DropdownItem,
} from "reactstrap";

import { useAuth0 } from "@auth0/auth0-react";
import CheckNewUser from './CheckNewUser';

const NavBar = () => {
  const user_signedIn = SignedInUser()
  const [isOpen, setIsOpen] = useState(false);
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();
  const toggle = () => setIsOpen(!isOpen);
  const [saldo, setSaldo] = useState(); // Fixed the order of state variable and its setter

  const logoutWithRedirect = () =>
    logout({
        logoutParams: {
          returnTo: window.location.origin,
        }
    });

  CheckNewUser();
  console.log(user_signedIn.credit_amount)

  return (
    <div className="nav-container">
      <Navbar light expand="md" container={false}>
        <Container>
          {!isAuthenticated ? (
            <Button
              id="qsLoginBtn"
              color="primary"
              className="login_button"
              onClick={() => loginWithRedirect()}
            >
              Logga in
            </Button>
          ) : (
            <NavbarToggler onClick={toggle} className="toggler_button" caret="true">
              <span className="user-info">
                <img
                  src={user.picture}
                  alt="Profile"
                  className="nav-user-profile d-inline-block rounded-circle mr-3"
                  width="50"
                />
              </span>
            </NavbarToggler>
          )}
          <NavbarBrand className="" />
          <Collapse isOpen={isOpen} navbar>
            <Nav
              className="d-md-none justify-content-between"
              navbar
              style={{ minHeight: 100 }}
            >
              <DropdownItem>
                {isAuthenticated && (
                  <h6 className="d-inline-block">
                    Inloggad som: {user.name} <br/>
                    Saldo: {saldo !== undefined ? saldo : user_signedIn.credit_amount}
                  </h6>
                )}
                <br></br>
                <FontAwesomeIcon icon="map" className="mr-3" />
                <RouterNavLink
                  to="/"
                  id="qsLogoutBtn"
                >  Karta
                </RouterNavLink>
                <br></br>
                <FontAwesomeIcon icon="play" className="mr-3" />
                <RouterNavLink
                  to="/rent"
                  id="qsLogoutBtn"
                >  Pågående resa
                </RouterNavLink>
                <br></br>
                <FontAwesomeIcon icon="external-link-square-alt" className="mr-3" />
                <a href="http://localhost:3000/profile">Profile "Extern Webbplats"</a>
                <br></br>
                <FontAwesomeIcon icon="power-off" className="mr-3" />
                <RouterNavLink
                  to="#"
                  id="qsLogoutBtn"
                  onClick={() => logoutWithRedirect()}
                >  Logga ut
                </RouterNavLink>
              </DropdownItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;