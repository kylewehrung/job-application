import React, { useEffect, useState } from "react";
import styled from "styled-components";

function ApplicationQuestions() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // Store user answers in state

    useEffect(() => {
        fetch("/application_questions")
        .then((r) => r.json())
        .then(setQuestions);
    }, []);

    // Function to update user answers in state
    const handleAnswerChange = (questionId, answer) => {
        setAnswers({ ...answers, [questionId]: answer });
    };

    // Function to submit answers to the backend
    const submitAnswers = () => {
        // Send 'answers' to the backend using fetch or your preferred method
        fetch("/submit_answers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(answers),
        })
        .then((response) => {
            // Handle the response as needed
        });
    };

    return (
        <BaseBackground>
            <Background>
                {questions.map((question) => (
                    <Column key={question.id}>
                        <p>{question.open_ended_questions}</p>
                        <input
                            type="text"
                            placeholder="Enter your answer"
                            value={answers[question.id] || ""}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        />
                    </Column>
                ))}
                <button onClick={submitAnswers}>Submit Answers</button>
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
  background-image: url("https://www.boredart.com/wp-content/uploads/2017/02/cream-yellow.png");
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