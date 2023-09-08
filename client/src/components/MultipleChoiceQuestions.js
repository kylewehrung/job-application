import React from "react";
import styled from "styled-components";

function MultipleChoiceQuestions({ questions, handleMultipleChoiceChange }) {



  return (
    <div>
      {questions
        .filter((question) => question.multiple_choice_questions)
        .map((question) => {
            const choicesObject = (question.multiple_choice_questions);


          return (
            <Column key={question.id}>
              <p>{choicesObject.question}</p>
              <label htmlFor={`multipleChoiceSelect-${question.id}`}>
                Choose an option:
              </label>

              <select
                name={`multipleChoiceSelect-${question.id}`}
                id={`multipleChoiceSelect-${question.id}`}
                onChange={(e) => {
                  handleMultipleChoiceChange(question.id, e.target.value);
                }}
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
    </div>
  );
}

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-bottom: 10px;
  margin-left: 250px;
  background-attachment: fixed;
`;

export default MultipleChoiceQuestions;



