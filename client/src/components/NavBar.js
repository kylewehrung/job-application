import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Button from "./styles/Button";


function NavBar({ user, setUser }) {
  const history = useHistory();
  
  function handleLogoutClick() {
    fetch("/logout", { method: "DELETE" }).then((r) => {
      if (r.ok) {
        setUser(null);
      }
    });
  }
  
  

  return (
    <Wrapper>
      <Nav>
        <Button color="third" onClick={handleLogoutClick}>
          Logout
        </Button>
        <Button color="third" onClick={() => history.goBack()}>
          Go Back
        </Button>
      </Nav>
    </Wrapper>
  );
}


const Wrapper = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
`;


const Nav = styled.nav`
  display: flex;
  gap: 4px;
  position: absolute;
  right: 2230px;
  top: 4px;
`;

export default NavBar;

