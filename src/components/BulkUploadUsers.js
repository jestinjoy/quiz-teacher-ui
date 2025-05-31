import React, { useState } from "react";

const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:8000"
  : process.env.REACT_APP_SERVER_IP;

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
      const res = await fetch(`${API_BASE}/teacher/bulk_upload_users`, {
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
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>📥 Bulk Upload Users</h2>
      <p>
        Please upload a CSV with the following headers:<br />
        <code>name,email,password,role,college,batch,semester,course</code>
      </p>
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
