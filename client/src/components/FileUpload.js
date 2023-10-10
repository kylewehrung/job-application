import React from "react";


// Create a component for file upload
function FileUpload({ handleFileUpload }) {
  return (
    <div className="mb-3">
      <label htmlFor="fileInput" className="form-label">
        Upload Resume
      </label>
      <input type="file" id="fileInput" onChange={handleFileUpload} />
    </div>
  );
}

export default FileUpload;