import React from "react";
import styled from "styled-components";


function YesNoQuestions({ questions, answers, handleYesNoChange }) {

  return (

    <div>
      {questions
        .filter((question) => question.yes_no_questions)
        .map((question) => (
          <Column key={question.id}>
            <StyledParagraph>{question.yes_no_questions}</StyledParagraph>
            <RadioButtonContainer>
              <CustomInput
                type="radio"
                name={`yesNoOption-${question.id}`}
                value="Yes"
                checked={answers[question.id] === "Yes"}
                onChange={() => handleYesNoChange(question.id, "Yes")}
              />
              <span>
                <StyledYesNo>Yes</StyledYesNo>
              </span>
            </RadioButtonContainer>
            <RadioButtonContainer>
              <CustomInput
                type="radio"
                name={`yesNoOption-${question.id}`}
                value="No"
                checked={answers[question.id] === "No"}
                onChange={() => handleYesNoChange(question.id, "No")}
              />
              <span>
                <StyledYesNo>No</StyledYesNo>
              </span>
            </RadioButtonContainer>
          </Column>
        ))}
    </div>
  );
}




const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-bottom: 25px;
  background-attachment: fixed;
`;

const CustomInput = styled.input`
  display: none; /* Hide the default radio button */
`;

const RadioButtonContainer = styled.label`
  display: flex;
  align-items: center;
  margin-top: 5px;
  cursor: pointer;

  /* Style the custom radio button */
  span {
    width: 40px;
    height: 40px;
    border: 4px solid white;
    border-radius: 50%;
    background-color: transparent;
    margin-right: 5px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.2s ease-in-out;
  }

  /* Change the background color of the span when the input is checked */
  input:checked + span {
    background-color: white;
  }
`;


const StyledParagraph = styled.p`
  font-size: 16px;
  font-weight: bold; 
  font-family: cascadia;

`;

const StyledYesNo = styled.p`
  margin-left: 75px;
  margin-bottom: 1px;
  font-size: 16px;
  font-weight: bold; 
  font-family: cascadia;
`;




export default YesNoQuestions;

