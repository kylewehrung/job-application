import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Input from "./styles/Input";
import Button from "./styles/Button";
import { useHistory } from "react-router-dom";
import { useUser } from "./context";
import YesNoQuestions from "./YesNoQuestions";
import MultipleChoiceQuestions from "./MultipleChoiceQuestions";

function ApplicationQuestions() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [questionId, setQuestionId] = useState(null);
  const [file, setFile] = useState(null); // State to manage file uploads
  const history = useHistory();
  const { user } = useUser();

  const handleYesNoChange = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleMultipleChoiceChange = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  useEffect(() => {
    fetch("/questions")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch question data.");
        }
        return response.json();
      })
      .then((data) => {
        setQuestions(data);
      })
      .catch((error) => console.log("catch error:", error));
  }, []);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append("file", file);
    // Add other form data to the formData object here in the future

    fetch(`/application_questions/${questionId}/submit_answer`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        history.push(`/user_answers/${user.id}`, { answers });
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  return (
    <BaseBackground>
      <Background>
        <Content>
          {/* Single file upload input */}
          <div className="mb-3">
            <label htmlFor="fileInput" className="form-label">
              Upload File
            </label>
            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
            />
          </div>

          {/* Map and render questions */}
          {questions
            .filter((question) => question.open_ended_questions)
            .map((question) => (
              <Column key={question.id}>
                <StyledParagraph>{question.open_ended_questions}</StyledParagraph>
                <Input
                  type="text"
                  placeholder={
                    question.id < 8
                      ? `Enter Your ${question.open_ended_questions}`
                      : "Enter Your Answer"
                  }
                  value={answers[question.id] || ""}
                  onChange={(e) => {
                    handleAnswerChange(question.id, e.target.value);
                    setQuestionId(question.id);
                  }}
                />
              </Column>
            ))}
          <div>
            <YesNoQuestions
              questions={questions}
              handleYesNoChange={handleYesNoChange}
            />
            <MultipleChoiceQuestions
              questions={questions}
              handleMultipleChoiceChange={handleMultipleChoiceChange}
            />
          </div>
          <Button onClick={handleSubmit}>Submit Answers</Button>
        </Content>
      </Background>
    </BaseBackground>
  );
}

const BaseBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  background-color: white;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  min-height: 100vh;
`;

const Background = styled.div`
  width: 60vw;
  background-color: #f8f0e3;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-bottom: 35px;
  text-align: left;
`;

const StyledParagraph = styled.p`
  margin: 0;
`;

export default ApplicationQuestions;

