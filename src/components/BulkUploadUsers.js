import React, { useState } from "react";

const BulkUploadUsers = ({ onBack }) => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await fetch("http://localhost:8000/teacher/bulk_upload_users", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Failed to upload users.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Bulk Upload Users</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload CSV"}
      </button>
      <button onClick={onBack} style={{ marginLeft: "1rem" }}>
        ← Back
      </button>

      {result && (
        <div style={{ marginTop: "1rem" }}>
          ✅ {result.created} users added.<br />
          ⚠️ {result.failed} failed.
        </div>
      )}
    </div>
  );
};

export default BulkUploadUsers;