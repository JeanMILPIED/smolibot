import React, { useState } from 'react';

function FileUploader() {
  const [status, setStatus] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      setStatus('Please select a valid PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('✅ PDF file uploaded successfully!');
      } else {
        setStatus('❌ Failed to upload PDF file.');
      }
    } catch (err) {
      setStatus('❌ Error uploading file.');
    }
  };

  return (
    <div className="p-4">
      <input type="file" accept="application/pdf" onChange={handleFileUpload} className="mb-2" />
      {status && <p className="text-sm text-gray-700">{status}</p>}
    </div>
  );
}

export default FileUploader;