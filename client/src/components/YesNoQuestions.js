import React from "react";
import styled from "styled-components";



function YesNoQuestions({ questions, handleYesNoChange }) {
  return (
    <div>
      {questions
        .filter((question) => question.yes_no_questions)
        .map((question) => (
          <Column key={question.id}>
            <p>{question.yes_no_questions}</p>
            <RadioButtonContainer>

                <CustomInput 
                type="radio"
                name={`yesNoOption-${question.id}`}
                value="Yes"
                onChange={() => {
                  handleYesNoChange(question.id, "Yes");
                }}
              />

              <span>
              <StyledParagraph>Yes</StyledParagraph>
              </span>

            </RadioButtonContainer>
            <RadioButtonContainer>
              <CustomInput   
                type="radio"
                name={`yesNoOption-${question.id}`}
                value="No"
                onChange={() => {
                  handleYesNoChange(question.id, "No");
                }}
              />
              
              <span>
                <StyledParagraph>No</StyledParagraph>
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
  margin-bottom: 10px;
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
margin-left: 75px;
margin-bottom: 1px;
`;



export default YesNoQuestions;




