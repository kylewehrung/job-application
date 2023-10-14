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




// Load "Yes/No" answers into state
useEffect(() => {
  const storedAnswers = JSON.parse(localStorage.getItem('answers')) || {};
  setAnswers(storedAnswers);

  console.log("Initial 'answers' state when loading from local storage:", storedAnswers);

  // Load answers for "Yes/No" questions into state
  if (storedAnswers[10]) {
    handleYesNoChange(10, storedAnswers[10]);
  }
  if (storedAnswers[11]) {
    handleYesNoChange(11, storedAnswers[11]);
  }
}, []);


const handleYesNoChange = (questionId, answer) => {
  const storedAnswers = JSON.parse(localStorage.getItem('answers')) || {};

  const updatedAnswers = { ...storedAnswers, [questionId]: answer };
  localStorage.setItem('answers', JSON.stringify(updatedAnswers));

  // Update the state with the new answer
  setAnswers(updatedAnswers);
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
        const email = extractEmails(textContent);
        const phone = extractPhones(textContent);
  
        if (email) {
          setEmailFromResume(email.join(", "));
          updateAnswers({ 2: email.join(", ") }); // Set the answer for question 2
          setEmailInputValue(email.join(", "));
        }
  
        if (phone) {
          setPhoneFromResume(phone.join(", "));
          updateAnswers({ 3: phone.join(", ") }); // Set the answer for question 3
          setPhoneInputValue(phone.join(", "));
        }
  
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
    saveAnswersToLocalStorage(answers);  // Save to local storage
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
    saveAnswersToLocalStorage(answers);  // Save to local storage
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







// The first useEffect initializes the state with data from local storage and restores email and phone input values
useEffect(() => {
  // Retrieve stored answers from local storage or an empty object if nothing is found
  const storedAnswers = JSON.parse(localStorage.getItem('answers')) || {};

  setAnswers(storedAnswers);

  setEmailInputValue(storedAnswers[2] || '');
  setPhoneInputValue(storedAnswers[3] || '');

  // Save the modified answers 
  localStorage.setItem('answers', JSON.stringify(storedAnswers));
}, []);


// The second useEffect is responsible for saving answers, including email and phone, to local storage whenever they change
useEffect(() => {
  // Create a modified copy of 'answers' to include the current email and phone values
  const modifiedAnswers = { ...answers };
  modifiedAnswers[2] = emailInputValue; // Update email value
  modifiedAnswers[3] = phoneInputValue; // Update phone value

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





  




  const handleAnswerChange = (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    saveAnswersToLocalStorage(newAnswers);
  };
  
  const saveAnswersToLocalStorage = (answers) => {
    localStorage.setItem('answers', JSON.stringify(answers));
  };
  

  
  


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
            handleMultipleChoiceChange={handleMultipleChoiceChange}
          />
          {/* Render Submit button here */}
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



export default ApplicationQuestions;

