import React, { useEffect, useState } from "react";

const SelectQuestions = ({ quizId, selectedQuestions, setSelectedQuestions, onDone }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load categories on mount
  useEffect(() => {
    fetch("http://localhost:8000/teacher/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  // Load subcategories when a category is selected
  useEffect(() => {
    setSelectedSubcategory("");
    if (selectedCategory) {
      fetch(`http://localhost:8000/teacher/subcategories/${selectedCategory}`)
        .then((res) => res.json())
        .then(setSubcategories)
        .catch(console.error);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory]);

  // Load questions when subcategory or category changes
  useEffect(() => {
    if (selectedCategory) {
      setLoading(true);
      let url = "http://localhost:8000/teacher/questions";
      url += selectedSubcategory
        ? `?subcategory_id=${selectedSubcategory}`
        : `?category_id=${selectedCategory}`;

      fetch(url)
        .then((res) => res.json())
        .then(setQuestions)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setQuestions([]);
    }
  }, [selectedCategory, selectedSubcategory]);

  const handleToggle = (id) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((qid) => qid !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!quizId || selectedQuestions.length === 0) {
      alert("Please select at least one question.");
      return;
    }

    setSubmitting(true);
    fetch("http://localhost:8000/teacher/assign_questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quiz_id: quizId,
        question_ids: selectedQuestions,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to assign questions");
        return res.json();
      })
      .then(() => {
        alert("Questions assigned successfully!");
        onDone();  // proceed to AssignStudents screen
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred while assigning questions.");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div>
      <h3>Select Questions for Quiz</h3>

      {/* Category Selection */}
      <div style={{ marginBottom: "1rem" }}>
        <label>Category:</label>{" "}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory Selection */}
      {subcategories.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <label>Subcategory:</label>{" "}
          <select
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
          >
            <option value="">-- Select Subcategory --</option>
            {subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Question List */}
      {loading ? (
        <p>Loading questions...</p>
      ) : questions.length === 0 ? (
        <p>No questions available.</p>
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {questions.map((q) => (
            <li key={q.id} style={{ marginBottom: "10px" }}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedQuestions.includes(q.id)}
                  onChange={() => handleToggle(q.id)}
                  style={{ marginRight: "8px" }}
                />
                {q.question_text}
              </label>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: "1rem" }}>
        <strong>Selected Question IDs:</strong>{" "}
        {selectedQuestions.join(", ") || "None"}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{ marginTop: "1rem" }}
      >
        {submitting ? "Submitting..." : "Submit Questions and Continue"}
      </button>
    </div>
  );
};

export default SelectQuestions;
