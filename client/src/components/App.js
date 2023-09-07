import React, { useEffect, useState } from "react";
import { UserContext } from "./context";
import {  useHistory, Route, Switch } from "react-router-dom";
import Login from "./Login";
import styled from "styled-components";
import ApplicationQuestions from "./ApplicationQuestions";
import UserAnswers from "./UserAnswers";



function App() {
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    });
  }, []);

  const handleLogin = (user) => {
    setUser(user);
    history.push("/application_questions");
  };

  if (!user) return <Login handleLogin={handleLogin} />;

  return (
    <AppWrapper>
    <UserContext.Provider value={{ user, setUser }}>
     <Switch>

      <Route path="/application_questions">
        <ApplicationQuestions/>
      </Route>
    
      <Route path="/user_answers/:userId" >
      <UserAnswers/>
      </Route>

     </Switch>
      </UserContext.Provider>
    </AppWrapper>
  );
}



const AppWrapper = styled.div`
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  opacity: 0.9;
`;

export default App;

