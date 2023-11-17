import React, { useState } from "react";
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
  linkedInInputValue,
  setLinkedInInputValue,
  answers,
  handleAnswerChange,
  fullNameError,
  emailError,
  phoneError,
}) {
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <Column>
      {questions
        .filter((question) => question.open_ended_questions)
        .map((question) => (
          <div key={question.id}>
            {question.id !== 9 ? (
              <>
                <StyledParagraph>{question.open_ended_questions}</StyledParagraph>
                {question.id === 8 ? (
                  <>
                    <StyledInput
                      type="text"
                      placeholder="Enter Your Salary"
                      value={answers[8] || ""}
                      onChange={(e) => {
                        let inputValue = e.target.value;
                        if (/[^0-9$,-]/.test(inputValue)) {
                          setErrorMessage("Please enter salary in this format: $00,000");
                        } else {
                          setErrorMessage(""); // Clear the error message
                          handleAnswerChange(8, inputValue);
                        }
                      }}
                    />
                    {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                  </>
                ) : (
                  <StyledInput
                    type="text"
                    placeholder={`Enter Your ${question.open_ended_questions}`}
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
                        ? question.id === 5
                        : linkedInInputValue
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
                        handleAnswerChange(4, e.target.value);
                      } else if (question.id === 5) {
                        console.log(linkedInInputValue)
                        setLinkedInInputValue(e.target.value)
                      } else {
                        handleAnswerChange(question.id, e.target.value);
                      }
                    }}
                  />
                )}
                {question.id === 1 && fullNameError && (
                  <ErrorMessage>{fullNameError}</ErrorMessage>
                )}
                {question.id === 2 && emailError && (
                  <ErrorMessage>{emailError}</ErrorMessage>
                )}
                {question.id === 3 && phoneError && (
                  <ErrorMessage>{phoneError}</ErrorMessage>
                )}
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

const ErrorMessage = styled.div`
  color: red;
  font-size: 16px;
  font-family: cascadia;
  margin-top: 5px;
`;

export default OpenEndedQuestions;
