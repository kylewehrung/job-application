import React from "react";
import styled from "styled-components";
import TextArea from "./styles/TextArea";


function CoverLetter({
  questions,
  answers,
  handleAnswerChange,
}) {
  return (
    <div>
      {questions
        .filter((question) => question.id === 9)
        .map((question) => (
          <Column key={question.id}>
            <StyledParagraph>
              Add a cover letter or anything else you'd like to say about yourself
            </StyledParagraph>
            <TextAreaWithPreserveFormatting
              placeholder="Enter Your Answer"
              value={answers[question.id] || ""}
              onChange={(e) => {
                handleAnswerChange(9, e.target.value);
              }}
            />
          </Column>
        ))}
    </div>
  );
}

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-bottom: 100px;
  margin-top: -25px;
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

const TextAreaWithPreserveFormatting = styled(TextArea)`
  white-space: pre-wrap;
`;


export default CoverLetter;
