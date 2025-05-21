import React, { useEffect, useState } from "react";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);

  const fetchQuizzes = () => {
    fetch("http://localhost:8000/teacher/quizzes?include_creator=true")
      .then((res) => res.json())
      .then(setQuizzes);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const toggleActive = (quizId) => {
    fetch(`http://localhost:8000/teacher/toggle_quiz_active/${quizId}`, {
      method: "POST"
    })
      .then((res) => res.json())
      .then(() => fetchQuizzes());
  };

  const toggleStatus = (quizId) => {
    fetch(`http://localhost:8000/teacher/toggle_quiz_status/${quizId}`, {
      method: "POST"
    })
      .then((res) => res.json())
      .then(() => fetchQuizzes());
  };

  return (
    <div>
      <h2>Quiz List</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Total Marks</th>
            <th>Duration</th>
            <th>Created By</th>
            <th>is_active</th>
            <th>status</th>
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
                <button onClick={() => toggleActive(q.id)}>
                  Toggle Active
                </button>
                <button onClick={() => toggleStatus(q.id)} style={{ marginLeft: "0.5rem" }}>
                  Toggle Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizList;
