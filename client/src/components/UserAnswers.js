import styled from "styled-components";
import React from "react";
import { useLocation } from "react-router-dom";

function UserAnswers({ userEmail }) {
  const { state } = useLocation();
  const { answers } = state;

  return (
    <UserAnswersContainer>
      <UserEmail>User Email: {userEmail}</UserEmail>
      <AnswersHeader>Answers:</AnswersHeader>
      <AnswersList>
        {Object.keys(answers).map((questionId) => (
          <AnswerItem key={questionId}>
            Question {questionId}: {answers[questionId]}
          </AnswerItem>
        ))}
      </AnswersList>
    </UserAnswersContainer>
  );
}

const UserAnswersContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
`;

const UserEmail = styled.h1`
  font-family: cascadia;
  font-size: 40px;
  color: #007bff;
  margin-bottom: 20px;
`;

const AnswersHeader = styled.h2`
  font-family: cascadia;
  font-size: 40px;
  margin-top: 20px;
`;

const AnswersList = styled.ul`
  list-style-type: none;
  font-family: cascadia;
  padding: 0;
  margin: 0;
`;

const AnswerItem = styled.li`
  font-size: 25px;
  margin-bottom: 10px;
  border-left: 4px solid #007bff;
  padding-left: 10px;
  font-family: cascadia;
`;

export default UserAnswers;
