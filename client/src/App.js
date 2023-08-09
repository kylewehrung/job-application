import React, { useState } from "react";
import { UserContext } from "./context";
import { Route, useHistory } from "react-router-dom"; 
import SignUpForm from "./SignUpForm"; 

function App() {
  const [user, setUser] = useState(null);
  const history = useHistory();

  const handleLogin = (user) => {
    setUser(user);
    history.push("/"); 
  };

  return (
    <div className="App">
    <UserContext.Provider value={{ user, setUser }}>
      <Route path="/">
        <SignUpForm onLogin={handleLogin} />
      </Route>
      </UserContext.Provider>
    </div>
  );
}


export default App;

