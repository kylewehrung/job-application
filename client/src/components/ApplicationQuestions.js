import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "./styles/Button";
import { useHistory } from "react-router-dom";
import { useUser } from "./context";
import YesNoQuestions from "./YesNoQuestions";
import MultipleChoiceQuestions from "./MultipleChoiceQuestions";
import CoverLetter from "./CoverLetter";
import OpenEndedQuestions from "./OpenEndedQuestions";
import FileUpload from "./FileUpload";




const ApplicationQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [questionId, setQuestionId] = useState(null);
  const [file, setFile] = useState(null);
  const [emailFromResume, setEmailFromResume] = useState("");
  const [phoneFromResume, setPhoneFromResume] = useState("");
  const [firstNameFromResume, setFirstNameFromResume] = useState("");
  const [lastNameFromResume, setLastNameFromResume] = useState("");
  const [resumeParsingSuccessful, setResumeParsingSuccessful] = useState(false);
  const [emailInputValue, setEmailInputValue] = useState(emailFromResume || "");
  const [phoneInputValue, setPhoneInputValue] = useState(phoneFromResume || "");
  const [firstNameInputValue, setFirstNameInputValue] = useState(firstNameFromResume || "");
  const [lastNameInputValue, setLastNameInputValue] = useState(lastNameFromResume || "");
  const history = useHistory();
  const { user } = useUser();

  // Fetch question data
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

  // Initialize state with answers from local storage or an empty object
  useEffect(() => {
    const storedAnswers = JSON.parse(localStorage.getItem("answers")) || {};
    setAnswers(storedAnswers);

    // Load answers for "Yes/No" and multiple-choice questions into state
    questions.forEach((question) => {
      if (question.type === "yesNo" || (question.type === "multipleChoice" && storedAnswers[question.id])) {
        handleAnswerChange(question.id, storedAnswers[question.id]);
      }
    });
  }, [questions]);

  // Handle changes for Yes/No questions
  const handleYesNoChange = (questionId, answer) => {
    const storedAnswers = JSON.parse(localStorage.getItem("answers")) || {};

    // Update stored answers
    const updatedAnswers = { ...storedAnswers, [questionId]: answer };
    localStorage.setItem("answers", JSON.stringify(updatedAnswers));

    setAnswers(updatedAnswers);
  };

  // Handle changes for Multiple-Choice questions
  const handleMultipleChoiceChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });

    // Update stored answers
    const updatedAnswers = { ...answers, [questionId]: answer };
    localStorage.setItem("answers", JSON.stringify(updatedAnswers));
  };

  // Update state with new answers
  const handleAnswerChange = (questionId, answer) => {
    updateAnswers({ [questionId]: answer });
  };

  // Update state with new answers and save them to local storage
  const updateAnswers = (newAnswers) => {
    const updatedAnswers = { ...answers, ...newAnswers };
    setAnswers(updatedAnswers);
    saveAnswersToLocalStorage(updatedAnswers);
  };

  // Save answers to local storage
  const saveAnswersToLocalStorage = (answers) => {
    localStorage.setItem("answers", JSON.stringify(answers));
  };

  // Handle file uploading
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();

      fileReader.onload = async () => {
        const pdfData = fileReader.result;
        const pdfText = await extractTextFromPDF(pdfData);

        handleInfoExtraction(pdfText);
        setFile(file);
      };

      fileReader.readAsArrayBuffer(file);
    }
  };

  // Extract text from a PDF
  const extractTextFromPDF = async (pdfData) => {
    const pdfjsLib = window["pdfjs-dist/build/pdf"];
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

  const handleInfoExtraction = (pdfText) => {
    const emailMatches = extractEmails(pdfText);
    const phoneMatches = extractPhones(pdfText);
  
    // New code to extract first and last names
    const names = extractNames(pdfText);
    console.log("Extracted Names:", names); // Log the extracted names
  
    if (names) {
      const [firstName, lastName] = names;
      console.log("First Name:", firstName);
      console.log("Last Name:", lastName);
      setFirstNameFromResume(firstName);
      setLastNameFromResume(lastName);
    }
  
    if (emailMatches) {
      const emails = emailMatches.join(", ");
      setEmailFromResume(emails);
      updateAnswers({ 2: emails });
      setEmailInputValue(emails);
    }
  
    if (phoneMatches) {
      const phones = phoneMatches.join(", ");
      setPhoneFromResume(phones);
      updateAnswers({ 3: phones });
      setPhoneInputValue(phones);
    }
  
    setResumeParsingSuccessful(emailMatches || phoneMatches);
  };
  

  // Helper function to extract emails using regex
  const extractEmails = (pdfText) => {
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
    return pdfText.match(emailRegex);
  };

  // Helper function to extract phone numbers using regex
  const extractPhones = (pdfText) => {
    const phoneRegex = /(\d{3}[-.\s]??\d{3}[-.\s]??\d{4}|\(\d{3}\)[-?.\s]??\d{3}[-.\s]??\d{4}|\d{3}[-.\s]??\d{4})/g;
    return pdfText.match(phoneRegex);
  };

  // Helper function to extract first and last names
  const extractNames = (pdfText) => {
    // Implement a regular expression or other logic to extract first and last names
    const nameRegex = /(\b[A-Z][a-z]*\b)/g; // Example regex for names
    const matches = pdfText.match(nameRegex);

    if (matches && matches.length >= 2) {
      // Extract the first and last names
      const firstName = matches[0];
      const lastName = matches[1];
      return [firstName, lastName];
    }

    return null;
  };







  
// The first useEffect initializes the state with data from local storage and restores email and phone input values
useEffect(() => {
  // Retrieve stored answers from local storage
  const storedAnswers = JSON.parse(localStorage.getItem('answers')) || {};

  setAnswers(storedAnswers);
  setFirstNameFromResume(storedAnswers[1] || '')
  setEmailInputValue(storedAnswers[2] || '');
  setPhoneInputValue(storedAnswers[3] || '');

  // Save the modified answers 
  localStorage.setItem('answers', JSON.stringify(storedAnswers));
}, []);


// The second useEffect is responsible for saving answers, including email and phone, to local storage whenever they change
useEffect(() => {
  // Create a modified copy of 'answers' to include the current email and phone values
  const modifiedAnswers = { ...answers };

  // Update email and phone value
  modifiedAnswers[2] = emailInputValue; 
  modifiedAnswers[3] = phoneInputValue; 

  // Save all answers, including email and phone, to local storage whenever they change
  localStorage.setItem('answers', JSON.stringify(modifiedAnswers));
}, [answers, emailInputValue, phoneInputValue]);

// The third useEffect is for saving the state to local storage before leaving the page
useEffect(() => {
  // Add a beforeunload event listener to handle saving data before leaving the page
  window.addEventListener('beforeunload', (event) => {
    const modifiedAnswers = { ...answers };

    // Update email and phone value
    modifiedAnswers[2] = emailInputValue; 
    modifiedAnswers[3] = phoneInputValue; 

    // Save all answers, including email and phone
    localStorage.setItem('answers', JSON.stringify(modifiedAnswers));
  });

  // Remove the event listener when the component is unmounted to avoid memory leaks
  return () => {
    window.removeEventListener('beforeunload', (event) => {
      const modifiedAnswers = { ...answers };

       // Update email and phone value
      modifiedAnswers[2] = emailInputValue;
      modifiedAnswers[3] = phoneInputValue; 

      // Save all answers, including email and phone, to local storage before unloading the page
      localStorage.setItem('answers', JSON.stringify(modifiedAnswers));
    });
  };
}, []);





  

const handleSubmit = (e) => {
  e.preventDefault();

  // Access the answers from the state variable 'answers' and send them to the server.
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

  formData.append("answers", answersJSON);

  fetch(`/${questionId}/submit_answer`, {
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
        {/* Render FileUpload component here */}
        <FileUpload handleFileUpload={handleFileUpload} />
        {/* Render OpenEndedQuestions component here */}
        <OpenEndedQuestions
          questions={questions}
          emailInputValue={emailInputValue}
          setEmailInputValue={setEmailInputValue}
          phoneInputValue={phoneInputValue}
          setPhoneInputValue={setPhoneInputValue}
          firstNameInputValue={firstNameInputValue}
          setFirstNameInputValue={setFirstNameInputValue}
          lastNameInputValue={lastNameInputValue}
          setLastNameInputValue={setLastNameInputValue}
          answers={answers}
          handleAnswerChange={handleAnswerChange}
        />
        {/* Render CoverLetter component here */}
        <CoverLetter
          questions={questions}
          answers={answers}
          handleAnswerChange={handleAnswerChange}
        />
        {/* Render YesNoQuestions and MultipleChoiceQuestions components here */}
        <YesNoQuestions
          questions={questions}
          answers={answers}
          handleYesNoChange={handleYesNoChange}
        />
        <MultipleChoiceQuestions
          questions={questions}
          answers={answers}
          handleMultipleChoiceChange={handleMultipleChoiceChange}
        />
        {/* Render Submit button here */}
        <Button onClick={handleSubmit}>Submit Answers</Button>
      </Content>
    </Background>
  </BaseBackground>
);
};




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



export default ApplicationQuestions;

