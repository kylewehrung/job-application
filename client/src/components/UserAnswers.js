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
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 5px;
`;

const UserEmail = styled.h1`
  font-size: 24px;
`;

const UserId = styled.h2`
  font-size: 20px;
  color: #007bff;
`;

const AnswersHeader = styled.h2`
  font-size: 20px;
  margin-top: 20px;
`;

const AnswersList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const AnswerItem = styled.li`
  margin-bottom: 10px;
`;


export default UserAnswers;


