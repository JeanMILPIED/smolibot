import React, { useState } from 'react';

function ImageUploader({ onExtractText }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleExtract = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    const response = await fetch(`${API_URL}/ocr`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    onExtractText(data.text || "No text found.");
  };

  return (
    <div className="p-4 border border-dashed border-gray-300 rounded mb-4">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && (
        <div className="my-2">
          <img src={previewUrl} alt="Preview" className="max-w-xs max-h-48" />
        </div>
      )}
      <button
        onClick={handleExtract}
        disabled={!file}
        className="mt-2 px-4 py-1 bg-blue-500 text-white rounded"
      >
        Extract Text from Image
      </button>
    </div>
  );
}

export default ImageUploader;