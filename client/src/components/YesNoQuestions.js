import React from "react";
import styled from "styled-components";
import Label from "./styles/Label";



function YesNoQuestions({ questions, handleYesNoChange }) {
  return (
    <div>
      {questions
        .filter((question) => question.yes_no_questions)
        .map((question) => (
          <Column key={question.id}>
            <p>{question.yes_no_questions}</p>
            <RadioButtonLabel>
              <input
                type="radio"
                name={`yesNoOption-${question.id}`}
                value="Yes"
                onChange={() => {
                  handleYesNoChange(question.id, "Yes");
                }}
              />
              <RadioButtonCustom checkedColor="#007bff" /> {/* Change the fill color */}
              <span>Yes</span>
            </RadioButtonLabel>
            <RadioButtonLabel>
              <input
                type="radio"
                name={`yesNoOption-${question.id}`}
                value="No"
                onChange={() => {
                  handleYesNoChange(question.id, "No");
                }}
              />
              <RadioButtonCustom checkedColor="#007bff" /> {/* Change the fill color */}
              <span>No</span>
            </RadioButtonLabel>
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

const RadioButtonLabel = styled(Label)`
  display: flex;
  align-items: center;
  margin-top: 5px;

  input[type="radio"] {
    display: none; /* Hide the default radio input */
  }
`;


const RadioButtonCustom = styled.span`
  width:  40px; 
  height: 40px; 
  border: 4px solid white; 
  border-radius: 50%; /* Make it circular */
  background-color: transparent; /
  margin-right: 5px; 

  /* Change the fill color when checked */
  input[type="radio"]:checked + & {
    background-color: white;
  }
`;

export default YesNoQuestions;




