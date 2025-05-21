import React, { useState, useEffect } from "react";

const BulkUpload = ({ onBack }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/teacher/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetch(`http://localhost:8000/teacher/subcategories/${selectedCategory}`)
        .then((res) => res.json())
        .then(setSubcategories);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory]);

  const handleUpload = () => {
    if (!file || !selectedSubcategory) {
      alert("Select a subcategory and file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetch(`http://localhost:8000/teacher/bulk_upload_questions?subcategory_id=${selectedSubcategory}&created_by=1`, {
      method: "POST",
      body: formData,
    })
      .then(res => res.json())
      .then(setResult)
      .catch(err => alert("Error uploading: " + err));
  };

  return (
    <div>
      <h2>Bulk Upload Questions (Aiken Format)</h2>
      <div>
        <label>Category: </label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">--Select--</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div>
        <label>Subcategory: </label>
        <select value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
          <option value="">--Select--</option>
          {subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div>
        <input type="file" accept=".txt" onChange={e => setFile(e.target.files[0])} />
      </div>

      <button onClick={handleUpload}>Upload</button>
      <button onClick={onBack} style={{ marginLeft: "1rem" }}>← Back to Home</button>

      {result && (
        <div style={{ marginTop: "1rem" }}>
          <strong>Uploaded:</strong> {result.uploaded}<br />
          {result.errors.length > 0 && (
            <details>
              <summary><strong>{result.errors.length} Errors</strong></summary>
              <ul>
                {result.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkUpload;
