import React from "react";
import styled from "styled-components";

function FileUpload({ handleFileUpload }) {
  return (
    <div className="mb-3">
      <StyledLabel htmlFor="fileInput" className="form-label">
        Upload Resume
      </StyledLabel>
      <HiddenInput type="file" id="fileInput" onChange={handleFileUpload} />
    </div>
  );
}

const StyledLabel = styled.label`
  position: absolute;
  left: 857px;
  font-size: 25px;
  font-weight: bold;
  font-family: cascadia;
  background-color: white; 
  color: black; 
  padding: 20px 30px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
`;

// Style the input to be hidden and hide the original text
const HiddenInput = styled.input`
  display: none;

  & + label::after {
    content: "Choose File";
    display: inline-block;
  }

  &:not(:empty) + label::after {
    content: attr(data-file-name);
  }
`;

export default FileUpload;
