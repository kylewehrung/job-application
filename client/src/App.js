import './App.css';
import { React, useEffect, useState } from "react";


function App() {

  const [applicationQuestions, setApplicationQuestions] = useState([])


  
  useEffect(() => {
    fetch("/application_questions")
    .then((r) => r.json())
    .then(setApplicationQuestions)
  }, [])



  const openEndedQuestions = applicationQuestions.map((applicationQuestion) => applicationQuestion.open_ended_questions)



  return (
    <div className="App">

        <p>
          Application questions: {openEndedQuestions}
        </p>

    </div>
  );



}

export default App;
