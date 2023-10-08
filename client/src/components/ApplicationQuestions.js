import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Input from "./styles/Input";
import Button from "./styles/Button";
import TextArea from "./styles/TextArea";
import { useHistory } from "react-router-dom";
import { useUser } from "./context";
import YesNoQuestions from "./YesNoQuestions";
import MultipleChoiceQuestions from "./MultipleChoiceQuestions";



function ApplicationQuestions() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [questionId, setQuestionId] = useState(null);
  const [file, setFile] = useState(null); 
  const [emailFromResume, setEmailFromResume] = useState(""); 
  const [phoneFromResume, setPhoneFromResume] = useState("");
  const [resumeParsingSuccessful, setResumeParsingSuccessful] = useState(false);
  const [emailInputValue, setEmailInputValue] = useState(emailFromResume || '');
  const [phoneInputValue, setPhoneInputValue] = useState(phoneFromResume || '');

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




  

  

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
  
      fileReader.onload = async () => {
        const pdfData = fileReader.result;
        const textContent = await extractTextFromPDF(pdfData);
  
        // Extract email and phone information and update state
        handleEmailExtraction(textContent);
        handlePhoneExtraction(textContent);
  
        // Update the file state here
        setFile(file);
      };
  
      fileReader.readAsArrayBuffer(file);
    }
  };
  
  // Extract text from a PDF 
  const extractTextFromPDF = async (pdfData) => {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    const numPages = pdf.numPages;
    let pdfText = "";
  
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      pdfText += pageText + "\n";
    }
  
    return pdfText;
  };
  
  // Helper function to extract emails using regex
  const extractEmails = (textContent) => {
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
    return textContent.match(emailRegex);
  };
  
  // Helper function to extract phone numbers using regex
  const extractPhones = (textContent) => {
    const phoneRegex = /(\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}|\(\d{3}\)[-?\.\s]??\d{3}[-\.\s]??\d{4}|\d{3}[-\.\s]??\d{4})/g;
    return textContent.match(phoneRegex);
  };
  
  // Handle email extraction and update state function
  const handleEmailExtraction = (textContent) => {
    const emailMatches = extractEmails(textContent);
    if (emailMatches) {
      const emails = emailMatches.join(", ");
      console.log("Extracted emails:", emails);
      setEmailFromResume(emails);
      setQuestionId(2);
      updateAnswers({ emails });
      setResumeParsingSuccessful(true);
      setEmailInputValue(emails);
    }
  };
  
  // Handle phone extraction and update state function
  const handlePhoneExtraction = (textContent) => {
    const phoneMatches = extractPhones(textContent);
    if (phoneMatches) {
      const phones = phoneMatches.join(", ");
      console.log("Extracted phone numbers:", phones);
      setPhoneFromResume(phones);
      setQuestionId(3);
      updateAnswers({ phones });
      setResumeParsingSuccessful(true);
      setPhoneInputValue(phones);
    }
  };
  
  // Update answers object function
  const updateAnswers = (newAnswers) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      ...newAnswers,
    }));
  };
  

  
  
  


  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };





  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Create a FormData object to send the file and answers as JSON
    const formData = new FormData();
  
    if (file) {
      formData.append("file", file);
    }
  
    // Convert answers to JSON string
    const answersJSON = JSON.stringify(answers);
  
    try {
      JSON.parse(answersJSON); // Attempt to parse the JSON
    } catch (error) {
      console.error('Invalid JSON in answers:', error.message);
      return; // Don't proceed with the request if JSON is invalid
    }
  
    if (questionId === 2) {
      answers[2] = emailInputValue;
    } else if (questionId === 3) {
      answers[3] = phoneInputValue;
    }
  
    formData.append("answers", JSON.stringify(answers));
  
    fetch(`/application_questions/${questionId}/submit_answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the Content-Type header to JSON
      },
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
            Upload Resume
          </label>
          <input
          type="file"
          id="fileInput"
          onChange={(e) => handleFileUpload(e)}
        />
        </div>

          <Column>
        {questions
          .filter((question) => question.open_ended_questions)
          .map((question) => (
            <div key={question.id}>
              {question.id !== 9 ? (
                <>
                  <StyledParagraph>{question.open_ended_questions}</StyledParagraph>
                  <Input
                    type="text"
                    placeholder={
                      question.id < 8
                        ? `Enter Your ${question.open_ended_questions}`
                        : "Enter Your Answer"
                    }
                    value={
                      question.id === 2
                        ? emailInputValue
                        : question.id === 3
                        ? phoneInputValue
                        : answers[question.id] || ""
                    }
                    onChange={(e) => {
                      if (question.id === 2) {
                        setEmailInputValue(e.target.value);
                      } else if (question.id === 3) {
                        setPhoneInputValue(e.target.value);
                      }
                      handleAnswerChange(question.id, e.target.value);
                      setQuestionId(question.id);
                    }}
                  />
                </>
              ) : null}
            </div>
          ))}

        {questions
          .filter((question) => question.id === 9)
          .map((question) => (
            <Column key={question.id}>
              <StyledParagraph>
                Add a cover letter or anything else you'd like to say about yourself
              </StyledParagraph>
              <TextArea
                placeholder="Enter Your Answer"
                onChange={(e) => {
                  handleAnswerChange(9, e.target.value);
                  setQuestionId(9);
                }}
              />
            </Column>
          ))}

</Column>
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
  margin-bottom: 30px;
  text-align: left;
`;

const StyledParagraph = styled.p`
margin-top: 35px;
margin-bottom: 5px;
margin: 1;
`;

export default ApplicationQuestions;


