import React from "react";
import styled from "styled-components";
import Input from "./styles/Input";
import Label from "./styles/Label";

function YesNoQuestions({ questions, handleYesNoChange }) {


  return (
    <div>
           {questions
        .filter((question) => question.yes_no_questions)
        .map((question) => (
        <Column key={question.id}>
          <p>{question.yes_no_questions}</p>
          <Label>
            <Input
              type="radio"
              name={`yesNoOption-${question.id}`}
              value="Yes"
              onChange={() => {
                  handleYesNoChange(question.id, "Yes");
              }}
            />{" "}
            Yes
          </Label>
          <Label>
            <Input
              type="radio"
              name={`yesNoOption-${question.id}`}
              value="No"
              onChange={() => {
                  handleYesNoChange(question.id, "No");
              }}
            />{" "}
            No
          </Label>
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


export default YesNoQuestions;





