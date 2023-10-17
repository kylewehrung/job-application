import React from "react";
import styled from "styled-components";
import Input from "./styles/Input";


function OpenEndedQuestions({
    questions,
    emailInputValue,
    setEmailInputValue,
    setPhoneInputValue,
    phoneInputValue,
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
                        : answers[question.id] || ""
                    }
                    onChange={(e) => {
                      if (question.id === 2) {
                        setEmailInputValue(e.target.value);
                      } else if (question.id === 3) {
                        setPhoneInputValue(e.target.value);
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


  