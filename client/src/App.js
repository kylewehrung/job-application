import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUpForm from "./SignUpForm";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<SignUpForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

