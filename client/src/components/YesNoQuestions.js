import React, { useState } from "react";
import styled from "styled-components";

function YesNoQuestions({ questions }) {
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleOptionChange = (questionId, option) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionId]: option,
    });
  };

  return (
    <div>
           {questions
        .filter((question) => question.yes_no_questions)
        .map((question) => (
        <Column key={question.id}>
          <p>{question.yes_no_questions}</p>
          <RadioLabel>
            <input
              type="radio"
              name={`yesNoOption-${question.id}`}
              value="Yes"
              checked={selectedOptions[question.id] === "Yes"}
              onChange={() => handleOptionChange(question.id, "Yes")}
            />{" "}
            Yes
          </RadioLabel>
          <RadioLabel>
            <input
              type="radio"
              name={`yesNoOption-${question.id}`}
              value="No"
              checked={selectedOptions[question.id] === "No"}
              onChange={() => handleOptionChange(question.id, "No")}
            />{" "}
            No
          </RadioLabel>
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
  margin-left: 250px;
  background-attachment: fixed;
`;

const RadioLabel = styled.label`
  display: block;
  margin-top: 5px;
`;

export default YesNoQuestions;





