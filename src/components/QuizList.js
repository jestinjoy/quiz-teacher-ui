import React, { useEffect, useState } from "react";

const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:8000"
  : process.env.REACT_APP_SERVER_IP;

const QuizList = ({ onViewReport }) => {
  const [quizzes, setQuizzes] = useState([]);

  const fetchQuizzes = () => {
    fetch(`${API_BASE}/teacher/quizzes?include_creator=true`)
      .then((res) => res.json())
      .then(setQuizzes);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const toggleActive = (quizId) => {
    fetch(`${API_BASE}/teacher/toggle_quiz_active/${quizId}`, { method: "POST" })
      .then(() => fetchQuizzes());
  };

  const toggleStatus = (quizId) => {
    fetch(`${API_BASE}/teacher/toggle_quiz_status/${quizId}`, { method: "POST" })
      .then(() => fetchQuizzes());
  };

  const deleteQuiz = (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      fetch(`${API_BASE}/teacher/delete_quiz/${quizId}`, { method: "DELETE" })
        .then((res) => {
          if (!res.ok) throw new Error("Deletion failed");
          return res.json();
        })
        .then(() => fetchQuizzes())
        .catch((err) => alert("Cannot delete quiz: " + err.message));
    }
  };

  return (
    <div>
      <h2>Quiz List</h2>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Total Marks</th>
            <th>Duration</th>
            <th>Created By</th>
            <th>Is Active</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((q) => (
            <tr key={q.id}>
              <td>{q.id}</td>
              <td>{q.title}</td>
              <td>{q.total_marks}</td>
              <td>{q.duration_minutes}</td>
              <td>{q.created_by_name || `User ${q.created_by}`}</td>
              <td>{q.is_active ? "✅" : "❌"}</td>
              <td>{q.status}</td>
              <td>
                <button onClick={() => toggleActive(q.id)}>Toggle Active</button>
                <button onClick={() => toggleStatus(q.id)} style={{ marginLeft: "0.5rem" }}>
                  Toggle Status
                </button>
                {q.status === "COMPLETED" && (
                  <button
                    onClick={() => onViewReport(q.id)}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    📊 View Report
                  </button>
                )}
              {!q.attempted && (
                <button
                  onClick={() => deleteQuiz(q.id)}
                  style={{ marginLeft: "0.5rem", color: "red" }}
                >
                  🗑️ Delete
                </button>
              )}

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizList;
