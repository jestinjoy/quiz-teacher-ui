import React, { useState } from "react";
import AddQuestionForm from "./components/AddQuestionForm";
import AddQuizForm from "./components/AddQuizForm";

function App() {
  const [view, setView] = useState("home");
  const [createdQuiz, setCreatedQuiz] = useState(null);

  const handleQuizCreated = (quiz) => {
    setCreatedQuiz(quiz);
    setView("quiz-created");
  };

  return (
    <div className="App" style={{ padding: "1rem", maxWidth: "800px", margin: "auto" }}>
      {view === "home" && (
        <>
          <h1>Teacher Dashboard</h1>
          <button onClick={() => setView("add-question")} style={{ marginRight: "1rem" }}>
            Add Question
          </button>
          <button onClick={() => setView("add-quiz")}>Add Quiz</button>
        </>
      )}

      {view === "add-question" && (
        <>
          <button onClick={() => setView("home")} style={{ marginBottom: "1rem" }}>
            ← Back to Home
          </button>
          <AddQuestionForm />
        </>
      )}

      {view === "add-quiz" && (
        <>
          <button onClick={() => setView("home")} style={{ marginBottom: "1rem" }}>
            ← Back to Home
          </button>
          <AddQuizForm onQuizCreated={handleQuizCreated} />
        </>
      )}

      {view === "quiz-created" && createdQuiz && (
        <>
          <button onClick={() => setView("home")} style={{ marginBottom: "1rem" }}>
            ← Back to Home
          </button>
          <h2>Quiz Created Successfully</h2>
          <p><strong>ID:</strong> {createdQuiz.id}</p>
          <p><strong>Title:</strong> {createdQuiz.title}</p>
        </>
      )}
    </div>
  );
}

export default App;
