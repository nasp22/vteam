import React, { useState } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  const [isOpen, setIsOpen] = useState(false);
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();
  const toggle = () => setIsOpen(!isOpen);

  const logoutWithRedirect = () =>
    logout({
        logoutParams: {
          returnTo: window.location.origin,
        }
    });

  CheckNewUser();

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

        ):(
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
                <h6 className="d-inline-block">Inloggad som: {user.name}</h6>
                )}
                <br></br>
                    <FontAwesomeIcon icon="map" className="mr-3" />
                    <RouterNavLink
                      to="/"
                      id="qsLogoutBtn"
                    >  Karta
                    </RouterNavLink>
                <br></br>
                  <FontAwesomeIcon icon="user" className="mr-3" />
                    <RouterNavLink
                      to="/profile"
                      activeClassName="router-link-exact-active"
                    > Profil
                    </RouterNavLink>
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
