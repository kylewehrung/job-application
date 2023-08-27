import React, { useEffect, useState } from "react";
import styled from "styled-components";



function ApplicationQuestions() {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        fetch("/application_questions")
        .then((r) => r.json())
        .then(setQuestions);
    }, [])



    return (

        <BaseBackground>
        <Background>
            {questions.map((question) => (
                <Column>
            <p>{question.open_ended_questions}</p>
                </Column>
            ))}
            </Background>
        </BaseBackground>

    )



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