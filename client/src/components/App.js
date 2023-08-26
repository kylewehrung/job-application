import React, { useEffect, useState } from "react";
import { UserContext } from "./context";
import {  useHistory } from "react-router-dom";
import Login from "./Login";
import styled from "styled-components";



function App() {
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    fetch("/api/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    });
  }, []);

  const handleLogin = (user) => {
    setUser(user);
    history.push('/application_questions');
  };

  if (!user) return <Login handleLogin={handleLogin} />;

  return (
    <AppWrapper>
    <UserContext.Provider value={{ user, setUser }}>
     
      </UserContext.Provider>
    </AppWrapper>
  );
}



const AppWrapper = styled.div`
  height: 100%;
  background-image: url("https://i.pinimg.com/originals/cc/9d/37/cc9d37ab453a095b985de4ca33d4b7fc.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  opacity: 0.9;
`;

export default App;

