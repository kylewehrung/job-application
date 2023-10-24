import React from "react";
import styled from "styled-components";
import Input from "./styles/Input";

function OpenEndedQuestions({
  questions,
  emailInputValue,
  setEmailInputValue,
  setPhoneInputValue,
  phoneInputValue,
  fullNameInputValue,
  setFullNameInputValue,
  answers,
  handleAnswerChange,
}) {
  return (
    <Column>
      {questions
        .filter((question) => question.open_ended_questions)
        .map((question) => (
          <div key={question.id}>
            {question.id !== 9 ? (
              <>
                <StyledParagraph>{question.open_ended_questions}</StyledParagraph>
                <StyledInput
                  type="text"
                  placeholder={
                    question.id < 8
                      ? `Enter Your ${question.open_ended_questions}`
                      : "Enter Your Answer"
                  }
                  value={
                    question.id === 1
                      ? fullNameInputValue
                      : question.id === 2
                      ? emailInputValue
                      : question.id === 3
                      ? phoneInputValue
                      : question.id === 4
                      ? answers[4] 
                      : answers[question.id] || ""
                  }
                  onChange={(e) => {
                    if (question.id === 1) {
                      setFullNameInputValue(e.target.value);
                    } else if (question.id === 2) {
                      setEmailInputValue(e.target.value);
                    } else if (question.id === 3) {
                      setPhoneInputValue(e.target.value);
                    } else if (question.id === 4) { 
                      console.log("Recent Company Input:", e.target.value);
                      handleAnswerChange(4, e.target.value); // Use the appropriate question ID for recent company
                    } else {
                      handleAnswerChange(question.id, e.target.value);
                    }
                  }}
                />
              </>
            ) : null}
          </div>
        ))}
    </Column>
  );
}

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-bottom: 30px;
  margin-top: 80px;
  text-align: left;
`;

const StyledParagraph = styled.p`
  margin-top: 35px;
  margin-bottom: 5px;
  font-size: 18px;
  font-weight: bold;
  font-family: cascadia;
  color: #333;
`;

const StyledInput = styled(Input)`
  margin-bottom: 20px;
`;

export default OpenEndedQuestions;
