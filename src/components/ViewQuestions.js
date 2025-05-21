import React, { useEffect, useState } from "react";

const ViewQuestions = () => {
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    fetch("http://localhost:8000/teacher/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error("Failed to fetch categories", err));
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (categoryId) {
      fetch(`http://localhost:8000/teacher/subcategories/${categoryId}`)
        .then((res) => res.json())
        .then(setSubcategories)
        .catch((err) => console.error("Failed to fetch subcategories", err));
    } else {
      setSubcategories([]);
      setSubcategoryId("");
    }
  }, [categoryId]);

  // Fetch questions when category or subcategory changes
  useEffect(() => {
    if (!categoryId) {
      setQuestions([]);
      return;
    }

    setLoading(true);
    let url = "http://localhost:8000/teacher/questions";
    if (subcategoryId) {
      url += `?subcategory_id=${subcategoryId}`;
    } else {
      url += `?category_id=${categoryId}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then(setQuestions)
      .catch((err) => console.error("Failed to fetch questions", err))
      .finally(() => setLoading(false));
  }, [categoryId, subcategoryId]);

const handleExport = async (format) => {
  let url = `http://localhost:8000/teacher/export/${format}`;
  if (subcategoryId) {
    url += `?subcategory_id=${subcategoryId}`;
  } else if (categoryId) {
    url += `?category_id=${categoryId}`;
  }

  try {
    const res = await fetch(url);
    const text = await res.text();

    const blob = new Blob([text], { type: "text/plain" });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${format}_questions.txt`;
    link.click();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (err) {
    console.error("Export failed:", err);
    alert("Failed to export questions.");
  }
};


  return (
    <div style={{ padding: "1rem" }}>
      <h2>View Questions</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label><strong>Category:</strong></label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ marginLeft: "1rem" }}
        >
          <option value="">-- Select Category --</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {subcategories.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <label><strong>Subcategory:</strong></label>
          <select
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
            style={{ marginLeft: "1rem" }}
          >
            <option value="">-- All Subcategories --</option>
            {subcategories?.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
      )}

    <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
  <button onClick={() => handleExport("aiken")} style={{ marginRight: "1rem" }}>
    Export as AIKEN
  </button>
  <button onClick={() => handleExport("gift")}>
    Export as GIFT
  </button>
</div>


      {loading ? (
        <p>Loading questions...</p>
      ) : (
        <table border="1" cellPadding="6" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Question</th>
            </tr>
          </thead>
          <tbody>
            {questions?.map((q) => (
              <tr key={q.id}>
                <td>{q.id}</td>
                <td>{q.question_text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewQuestions;
