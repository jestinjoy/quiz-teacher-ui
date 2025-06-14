import React, { useEffect, useState } from "react";
import SelectQuestions from "./SelectQuestions";
import AssignStudents from "./AssignStudents";

const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:8000"
  : process.env.REACT_APP_SERVER_IP;

const QuizList = ({ onViewReport }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);
  const [showStudentAssigner, setShowStudentAssigner] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const fetchQuizzes = () => {
    fetch(`${API_BASE}/teacher/quizzes?include_creator=true&include_summary=true`)
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
      <h2 style={{ marginBottom: "1rem" }}>📋 Quiz Management Dashboard</h2>

      {quizzes.map((q) => (
        <div key={q.id} style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "1rem",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
        }}>
          <div style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
            <div>
              <h3 style={{ margin: "0 0 4px" }}>{q.title}</h3>
              <div style={{ fontSize: "0.9rem", color: "#666" }}>
                Quiz ID: <strong>{q.id}</strong> | Created by: <strong>{q.created_by_name || `User ${q.created_by}`}</strong>
              </div>
              <div style={{ fontSize: "0.85rem", marginTop: "0.3rem" }}>
                🕒 Start Time: {q.start_time ? new Date(q.start_time).toLocaleString() : "Not set"}
                <br />
                🛑 End Time: {q.quiz_end_time ? new Date(q.quiz_end_time).toLocaleString() : "Not set"}
                <br />
                👥 Students Assigned: {q.students_assigned ?? 0}
                <br />
                ✅ Students Attempted: {q.students_attempted ?? 0}
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{
                padding: "4px 10px",
                borderRadius: "12px",
                backgroundColor: q.is_active ? "#d4edda" : "#f8d7da",
                color: q.is_active ? "#155724" : "#721c24",
                fontSize: "0.85rem"
              }}>
                {q.is_active ? "Active" : "Inactive"}
              </span>
              <span style={{
                padding: "4px 10px",
                borderRadius: "12px",
                backgroundColor: q.status === "COMPLETED" ? "#e2e3ff" : "#fff3cd",
                color: "#333",
                fontSize: "0.85rem"
              }}>
                {q.status}
              </span>
            </div>
          </div>

          <div style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}>
            ⏱ Duration: {q.duration_minutes} min | 📊 Total Marks: {q.total_marks}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button onClick={() => toggleActive(q.id)}>🔁 Toggle Active</button>
            <button onClick={() => toggleStatus(q.id)}>🔄 Toggle Status</button>

            {!q.has_questions && !q.has_assigned_students && (
              <>
                <button onClick={() => {
                  setActiveQuizId(q.id);
                  setShowQuestionSelector(true);
                }}>
                  ➕ Add Questions
                </button>
                <button onClick={() => {
                  setActiveQuizId(q.id);
                  setShowStudentAssigner(true);
                }}>
                  👥 Assign Students
                </button>
              </>
            )}

            {q.has_questions && !q.has_assigned_students && (
              <button onClick={() => {
                setActiveQuizId(q.id);
                setShowStudentAssigner(true);
              }}>
                👥 Assign Students
              </button>
            )}

            {q.status === "COMPLETED" && (
              <button onClick={() => onViewReport(q.id)}>📊 View Report</button>
            )}

            {!q.attempted && (
              <button onClick={() => deleteQuiz(q.id)} style={{ color: "red" }}>
                🗑 Delete
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Embedded Question Selector */}
      {showQuestionSelector && (
        <div style={{ border: "1px solid #ccc", padding: "1rem", marginTop: "1rem" }}>
          <SelectQuestions
            quizId={activeQuizId}
            selectedQuestions={selectedQuestions}
            setSelectedQuestions={setSelectedQuestions}
            onDone={() => {
              setShowQuestionSelector(false);
              setSelectedQuestions([]);
              fetchQuizzes();
            }}
          />
        </div>
      )}

      {/* Embedded Student Assigner */}
      {showStudentAssigner && (
        <div style={{ border: "1px solid #ccc", padding: "1rem", marginTop: "1rem" }}>
          <AssignStudents
            quizId={activeQuizId}
            onFinish={() => {
              setShowStudentAssigner(false);
              fetchQuizzes();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default QuizList;
