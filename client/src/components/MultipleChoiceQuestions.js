import React from "react";
import styled from "styled-components";
import Label from "./styles/Label";

function MultipleChoiceQuestions({ questions, answers, handleMultipleChoiceChange }) {



  return (
    <Column>
      {questions
        .filter((question) => question.multiple_choice_questions)
        .map((question) => {
            const choicesObject = (question.multiple_choice_questions);


          return (
            <Column key={question.id}>
              <StyledParagraph>{choicesObject.question}</StyledParagraph>
              <Label htmlFor={`multipleChoiceSelect-${question.id}`}/>
             
              <select
                className="form-select form-select-lg mb-3"
                name={`multipleChoiceSelect-${question.id}`}
                id={`multipleChoiceSelect-${question.id}`}
                onChange={(e) => {
                  handleMultipleChoiceChange(question.id, e.target.value);
                }}
                value={answers[question.id] || ''} // Update value to be submitted answer
              >
                <option value="">-- Please choose an option --</option>
                {choicesObject.choices.map((choice) => (
                  <option key={choice} value={choice}>
                    {choice}
                  </option>
                ))}
            </select>

            </Column>
          );
        })}
    </Column>
  );
}

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-left: -55px;
  margin-top: 10px;
  background-attachment: fixed;
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


export default MultipleChoiceQuestions;

