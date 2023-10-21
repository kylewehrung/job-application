import React from "react";
import styled from "styled-components";
import Input from "./styles/Input";

function OpenEndedQuestions({
  questions,
  emailInputValue,
  setEmailInputValue,
  setPhoneInputValue,
  phoneInputValue,
  firstNameInputValue,
  setFirstNameInputValue,
  lastNameInputValue,
  setLastNameInputValue,
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
                <Input
                  type="text"
                  placeholder={
                    question.id < 8
                      ? `Enter Your ${question.open_ended_questions}`
                      : "Enter Your Answer"
                  }
                  value={
                    question.id === 2
                      ? emailInputValue
                      : question.id === 3
                      ? phoneInputValue
                      : question.id === 1
                      ? `${firstNameInputValue} ${lastNameInputValue}`
                      : answers[question.id] || ""
                  }
                  onChange={(e) => {
                    if (question.id === 2) {
                      setEmailInputValue(e.target.value);
                    } else if (question.id === 3) {
                      setPhoneInputValue(e.target.value);
                    } else if (question.id === 1) {
                      const [firstName, lastName] = e.target.value.split(" ");
                      console.log("First Name:", firstName);
                      console.log("Last Name:", lastName);
                      setFirstNameInputValue(firstName);
                      setLastNameInputValue(lastName);
                    }
                    handleAnswerChange(question.id, e.target.value);
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
  margin-top: 50px;
  text-align: left;
`;

const StyledParagraph = styled.p`
  margin-top: 35px;
  margin-bottom: 5px;
  font-size: 18px;
  font-weight: bold;
  font-family: cascadia;
  color: #333;
  line-height: 1.5;
  text-align: left;
  text-decoration: none;
  `;


export default OpenEndedQuestions;
