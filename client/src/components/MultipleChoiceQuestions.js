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
              <p>{choicesObject.question}</p>
              <Label htmlFor={`multipleChoiceSelect-${question.id}`}>
                Choose an option:
              </Label>

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
  margin-bottom: 10px;
  margin-left: -55px;
  margin-top: 15px;
  background-attachment: fixed;
`;

export default MultipleChoiceQuestions;

