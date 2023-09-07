import React, { useEffect, useState } from "react";
import styled from "styled-components";

function ApplicationQuestions() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [questionId, setQuestionId] = useState(null); 

    useEffect(() => {
        fetch("/application_questions")
            .then((r) => r.json())
            .then(setQuestions);
    }, []);

    const handleAnswerChange = (questionId, answer) => {
        setAnswers({ ...answers, [questionId]: answer });
    };

    const submitAnswers = () => {
        if (questionId === null) {
            // No question selected, handle this case as needed
            return;
        }

        // Send 'answers' to the backend using fetch 
        fetch(`/application_questions/${questionId}/submit_answer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ answer: answers[questionId] || "" }),
        })
            .then((response) => {
                // Handle the response better in the future
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
  background-color: lightblue;
  /* background-image: url("https://www.boredart.com/wp-content/uploads/2017/02/cream-yellow.png"); */
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
