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

                <CustomInput checkedColor="#007bff"
                type="radio"
                name={`yesNoOption-${question.id}`}
                value="Yes"
                onChange={() => {
                  handleYesNoChange(question.id, "Yes");
                }}
              />

              <span>Yes</span>

            </RadioButtonContainer>
            <RadioButtonContainer>
              <CustomInput checkedColor="#007bff"  
                type="radio"
                name={`yesNoOption-${question.id}`}
                value="No"
                onChange={() => {
                  handleYesNoChange(question.id, "No");
                }}
              />
              
              <span>No</span>
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

const RadioButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
  cursor: pointer;
`;



const CustomInput = styled.input`
  width: 40px;
  height: 40px;
  border: 4px solid white;
  border-radius: 50%; 
  background-color: transparent;
  margin-right: 5px;

  /* Change the fill color when checked */
  &:checked + & {
    background-color: #007bff; /* Change the background color when checked */
  }
`;


export default YesNoQuestions;




