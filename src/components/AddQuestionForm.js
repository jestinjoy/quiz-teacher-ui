import React, { useState, useEffect } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

// Split plain text and math (<math>...</math>) blocks
const preprocessLatex = (text) => {
  const regex = /<math>(.*?)<\/math>/gs;
  let parts = [];
  let lastIndex = 0;
  const matches = [...text.matchAll(regex)];

  for (let match of matches) {
    const [fullMatch, latexContent] = match;
    const index = match.index;

    if (index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, index) });
    }

    parts.push({ type: "math", content: latexContent });
    lastIndex = index + fullMatch.length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }

  return parts;
};

const renderPreview = (text) => {
  const parts = preprocessLatex(text);
  return parts.map((part, index) =>
    part.type === "math" ? (
      <BlockMath key={index}>{part.content}</BlockMath>
    ) : (
      <div key={index} style={{ whiteSpace: "pre-wrap" }}>{part.content}</div>
    )
  );
};

const AddQuestionForm = () => {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/teacher/categories")
      .then(res => res.json())
      .then(setCategories)
      .catch(err => console.error("Category load failed:", err));
  }, []);

  useEffect(() => {
    if (categoryId) {
      fetch(`http://localhost:8000/teacher/subcategories/${categoryId}`)
        .then(res => res.json())
        .then(setSubcategories)
        .catch(err => console.error("Subcategory load failed:", err));
    } else {
      setSubcategories([]);
      setSubcategoryId("");
    }
  }, [categoryId]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    if (!subcategoryId) {
      alert("Please select a subcategory.");
      return;
    }

    const payload = {
      question_text: questionText,
      question_type: "MCQ",
      correct_answer: options[correctIndex],
      feedback: feedback,
      subcategory_id: parseInt(subcategoryId),
      created_by: 1,
      created_at: new Date().toISOString(),
      options: options.map((text, i) => ({
        text,
        is_correct: i === correctIndex
      }))
    };

    const res = await fetch("http://localhost:8000/teacher/add_question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert("✅ Question added!");
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectIndex(null);
      setFeedback("");
      // Intentionally not resetting category/subcategory
    } else {
      alert("❌ Error adding question");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
      <h2>Add MCQ Question (Use &lt;math&gt;...&lt;/math&gt; for LaTeX)</h2>

      {/* Category */}
      <div style={{ marginBottom: "1rem" }}>
        <label><strong>Category:</strong></label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ width: "100%", padding: "6px" }}
        >
          <option value="">-- Select Category --</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Subcategory */}
      <div style={{ marginBottom: "1rem" }}>
        <label><strong>Subcategory:</strong></label>
        <select
          value={subcategoryId}
          onChange={(e) => setSubcategoryId(e.target.value)}
          style={{ width: "100%", padding: "6px" }}
        >
          <option value="">-- Select Subcategory --</option>
          {subcategories.map(sub => (
            <option key={sub.id} value={sub.id}>{sub.name}</option>
          ))}
        </select>
      </div>

      {/* Question Text */}
      <textarea
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        rows={4}
        placeholder="Write your question here (use <math>...</math> for LaTeX)"
        style={{ width: "100%", padding: "8px" }}
      />
      <div style={{ marginTop: "0.5rem" }}>
        <strong>Preview:</strong>
        {renderPreview(questionText)}
      </div>

      {/* Feedback */}
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={2}
        placeholder="Optional feedback (will show after quiz)"
        style={{ width: "100%", marginTop: "1rem", padding: "8px" }}
      />
      {feedback.trim() && (
        <div style={{ marginTop: "0.5rem" }}>
          <strong>Feedback Preview:</strong>
          {renderPreview(feedback)}
        </div>
      )}

      {/* Options */}
      <h3 style={{ marginTop: "1rem" }}>Options:</h3>
      {options.map((opt, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <input
            type="text"
            value={opt}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={`Option ${index + 1}`}
            style={{ width: "100%", padding: "8px" }}
          />
          <div style={{ marginTop: "4px" }}>
            {renderPreview(opt)}
          </div>
          <label>
            <input
              type="radio"
              name="correct"
              checked={correctIndex === index}
              onChange={() => setCorrectIndex(index)}
            />
            Correct Answer
          </label>
        </div>
      ))}

      <button onClick={handleSubmit} style={{ padding: "10px 20px", marginTop: "1rem" }}>
        Submit
      </button>
    </div>
  );
};

export default AddQuestionForm;
