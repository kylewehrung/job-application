import React from "react";
import styled from "styled-components";
import TextArea from "./styles/TextArea";


function CoverLetter({
    questions,
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
            <TextArea
              placeholder="Enter Your Answer"
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
  margin-bottom: 30px;
  margin-top: -25px;
  text-align: left;
`;

const StyledParagraph = styled.p`
  margin-top: 35px;
  margin-bottom: 5px;
`;



export default CoverLetter;

