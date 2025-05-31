import React, { useEffect, useState } from "react";

const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:8000"
  : process.env.REACT_APP_SERVER_IP;

const ViewQuestions = () => {
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // For Edit Modal
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/teacher/categories`)
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error("Failed to fetch categories", err));
  }, []);

  useEffect(() => {
    if (categoryId) {
      fetch(`${API_BASE}/teacher/subcategories/${categoryId}`)
        .then((res) => res.json())
        .then(setSubcategories)
        .catch((err) => console.error("Failed to fetch subcategories", err));
    } else {
      setSubcategories([]);
      setSubcategoryId("");
    }
  }, [categoryId]);

  const fetchQuestions = () => {
    if (!categoryId) {
      setQuestions([]);
      return;
    }
    setLoading(true);
    let url = `${API_BASE}/teacher/questions`;
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
  };

  useEffect(() => {
    fetchQuestions();
  }, [categoryId, subcategoryId]);

  const handleExport = async (format) => {
    let url = `${API_BASE}/teacher/export/${format}`;
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

  const handleEditClick = async (questionId) => {
    try {
      const res = await fetch(`${API_BASE}/teacher/get_question/${questionId}`);
      const data = await res.json();
      setEditingQuestion(data);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to load question for editing", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        question_text: editingQuestion.question_text,
        feedback: editingQuestion.feedback,
        options: editingQuestion.options.map((o) => ({
          id: o.id,
          text: o.text,
          is_correct: o.is_correct,
        })),
      };
      await fetch(`${API_BASE}/teacher/update_question/${editingQuestion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      alert("Question updated!");
      setShowModal(false);
      fetchQuestions();
    } catch (err) {
      console.error("Failed to update", err);
      alert("Update failed");
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
          {categories.map((cat) => (
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
            {subcategories.map((sub) => (
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id}>
                <td>{q.id}</td>
                <td>{q.question_text}</td>
                <td>
                  <button onClick={() => handleEditClick(q.id)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && editingQuestion && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{ background: "white", padding: "2rem", width: "500px", borderRadius: "10px" }}>
            <h3>Edit Question</h3>
            <label>Question:</label><br />
            <textarea
              value={editingQuestion.question_text}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, question_text: e.target.value })}
              style={{ width: "100%", marginBottom: "1rem" }}
            />
            <label>Feedback:</label><br />
            <input
              type="text"
              value={editingQuestion.feedback || ""}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, feedback: e.target.value })}
              style={{ width: "100%", marginBottom: "1rem" }}
            />
            <div>
              {editingQuestion.options?.map((opt, idx) => (
                <div key={opt.id}>
                  <label>Option {idx + 1}:</label>
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => {
                      const updatedOptions = [...editingQuestion.options];
                      updatedOptions[idx].text = e.target.value;
                      setEditingQuestion({ ...editingQuestion, options: updatedOptions });
                    }}
                    style={{ width: "100%", marginBottom: "0.5rem" }}
                  />
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1rem", textAlign: "right" }}>
              <button onClick={() => setShowModal(false)} style={{ marginRight: "1rem" }}>Cancel</button>
              <button onClick={handleUpdate}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewQuestions;
