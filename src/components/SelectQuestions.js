import React, { useEffect, useState } from "react";

const SelectQuestions = ({ selectedQuestions, setSelectedQuestions }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    fetch("http://localhost:8000/teacher/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  // Fetch subcategories when category changes
    useEffect(() => {
    setSelectedSubcategory(""); // Reset previous subcategory selection

    if (selectedCategory) {
        fetch(`http://localhost:8000/teacher/subcategories/${selectedCategory}`)
        .then((res) => res.json())
        .then(setSubcategories);
    } else {
        setSubcategories([]);
    }
    }, [selectedCategory]);


  // Fetch questions when subcategory changes
    useEffect(() => {
    if (selectedCategory) {
        setLoading(true);
        let url = "http://localhost:8000/teacher/questions";
        if (selectedSubcategory) {
        url += `?subcategory_id=${selectedSubcategory}`;
        } else {
        url += `?category_id=${selectedCategory}`;
        }

        fetch(url)
        .then((res) => res.json())
        .then((data) => {
            setQuestions(data);
            setLoading(false);
        });
    } else {
        setQuestions([]);
    }
    }, [selectedCategory, selectedSubcategory]);



  const handleToggle = (id) => {
    if (selectedQuestions.includes(id)) {
      setSelectedQuestions(selectedQuestions.filter((qid) => qid !== id));
    } else {
      setSelectedQuestions([...selectedQuestions, id]);
    }
  };

  return (
    <div>
      <h3>Select Questions for Quiz</h3>

      {/* Category Dropdown */}
      <div style={{ marginBottom: "1rem" }}>
        <label>Category: </label>
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

      {/* Subcategory Dropdown */}
      {subcategories.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <label>Subcategory: </label>
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
        <p>No questions available for this subcategory.</p>
      ) : (
        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
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

      <div>
        <strong>Selected Question IDs:</strong>{" "}
        {selectedQuestions.join(", ") || "None"}
      </div>
    </div>
  );
};

export default SelectQuestions;
