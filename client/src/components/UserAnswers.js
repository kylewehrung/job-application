import styled from "styled-components";
import React from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

function UserAnswers({ userEmail }) {
  const { userId } = useParams();
  const { state } = useLocation();
  const { answers } = state;

  return (
    <UserAnswersContainer>
      <UserEmail>User Email: {userEmail}</UserEmail>
      <UserId>User ID: {userId}</UserId>
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
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const UserEmail = styled.h1`
  font-size: 40px;
  margin-bottom: 10px;
  color: #333;
`;

const UserId = styled.h2`
  font-size: 40px;
  color: #007bff;
  margin-bottom: 20px;
`;

const AnswersHeader = styled.h2`
  font-size: 40px;
  margin-top: 20px;
`;

const AnswersList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const AnswerItem = styled.li`
  font-size: 25px;
  margin-bottom: 10px;
  border-left: 4px solid #007bff;
  padding-left: 10px;
`;

export default UserAnswers;
