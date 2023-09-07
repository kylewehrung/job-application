import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom"; 
import { useUser } from "./context";
import YesNoQuestions from "./YesNoQuestions";


function ApplicationQuestions() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [questionId, setQuestionId] = useState(null);
    const history = useHistory(); 
    const { user } = useUser();



    const handleYesNoChange = (questionId, option) => {
        setAnswers({ ...answers, [questionId]: option });
      };



    useEffect(() => {
        fetch("/questions")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch question data.");
            }
            console.log("API Response:", response);
            return response.json();
        })
        .then((data) => {
            setQuestions(data);
        })
        .catch((error) => console.log("catch error:", error));
    }, []);




    const handleAnswerChange = (questionId, answer) => {
        setAnswers({ ...answers, [questionId]: answer });
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`/application_questions/${questionId}/submit_answer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ answer: answers[questionId] || "" }),
        })
        .then((response) => {
            history.push(`/user_answers/${user.id}`, { answers }); // Redirect to another page
        });
    };



    return (
        <BaseBackground>
            <Background>
                {questions
                    .filter((question) => question.open_ended_questions)
                    .map((question) => (
                        <Column key={question.id}>
                            <p>{question.open_ended_questions}</p>
                            <input
                                type="text"
                                placeholder="Enter your answer"
                                value={answers[question.id] || ""}
                                onChange={(e) => {
                                    handleAnswerChange(question.id, e.target.value);
                                    setQuestionId(question.id); 
                                }}
                            />
                        </Column>
                    ))}
                <div>
                    <YesNoQuestions 
                    questions={questions}
                    handleYesNoChange={handleYesNoChange}
                    />
                </div>
                <button onClick={handleSubmit}>Submit Answers</button>
            </Background>
        </BaseBackground>
    );
}


const BaseBackground = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url("https://www.drodd.com/images14/black15.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  height: 100vw;
  width: 100vw;
  background-attachment: fixed;
`;
const Background = styled.div`
  height: 100vw;
  width: 60vw;
  background-color: lightblue;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
`;


const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-bottom: 10px;
  margin-left: 250px;
  background-attachment: fixed;
`;

export default ApplicationQuestions;
