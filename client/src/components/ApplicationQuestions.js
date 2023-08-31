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

        <Wrapper>
            {questions.map((question) => (

            <p>{question.open_ended_questions}</p>

            ))}
        </Wrapper>

    )



}

const Wrapper = styled.div`
  background-image: url("https://images.unsplash.com/photo-1521942132694-5daae96ff62d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjMxNTYxOTE5&ixlib=rb-1.2.1&q=80&w=1080");
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 100vh;
`;



export default ApplicationQuestions;