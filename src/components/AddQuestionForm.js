import React, { useState } from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

const AddQuestionForm = () => {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [preview, setPreview] = useState(true);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    const payload = {
      question_text: questionText,
      question_type: "MCQ",
      correct_answer: options[correctIndex],
      feedback: "",
      subcategory_id: 1,
      created_by: 1,
      created_at: new Date().toISOString(),
      options: options.map((text, i) => ({
        text,
        is_correct: i === correctIndex
      }))
    };

    const res = await fetch("http://localhost:8000/teacher/add_question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert("Question added!");
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectIndex(null);
    } else {
      alert("Error adding question");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
      <h2>Add MCQ Question (LaTeX Supported)</h2>

      <textarea
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        rows={4}
        placeholder="Write your question here using LaTeX like \\frac{a}{b} + c = ?"
        style={{ width: "100%", padding: "8px" }}
      />

      {preview && (
        <div className="preview">
          <strong>Preview:</strong>
          <BlockMath>{questionText}</BlockMath>
        </div>
      )}

      <h3>Options:</h3>
      {options.map((opt, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <input
            type="text"
            value={opt}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={`Option ${index + 1}`}
            style={{ width: "100%", padding: "8px" }}
          />
          {preview && (
            <div style={{ backgroundColor: "#f0f0f0", padding: "6px" }}>
              <InlineMath>{opt}</InlineMath>
            </div>
          )}
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
