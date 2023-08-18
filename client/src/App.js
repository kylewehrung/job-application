import React, { useEffect, useState, useHistory } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUpForm from "./SignUpForm";
import Login from "login";


function App() {
  const [user, setUser] = useState(null);
  const history = useHistory();


  useEffect(() => {
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    })
  }, []);


  const handleLogin = (user) => {
    setUser(user);
    history.push("/application_questions")
  }

  if (!user) return <Login onLogin={handleLogin} />;

  
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/application_questions" element={<SignUpForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

