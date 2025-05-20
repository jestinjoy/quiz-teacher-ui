import React, { useState } from "react";
import AddQuestionForm from "./components/AddQuestionForm";
import AddQuizForm from "./components/AddQuizForm";
import SelectQuestions from "./components/SelectQuestions";
import AssignStudents from "./components/AssignStudents";

function App() {
  const [view, setView] = useState("home");
  const [quizId, setQuizId] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const handleQuizCreated = (quiz) => {
    setQuizId(quiz.id);
    setView("select-questions");
  };

  const handleQuestionsAssigned = () => {
    setView("assign-students");
  };

  const handleFinishAssigning = () => {
    alert("✅ Quiz setup complete!");
    setView("home");
    setQuizId(null);
    setSelectedQuestions([]);
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

      {view === "select-questions" && quizId && (
        <>
          <button onClick={() => setView("home")} style={{ marginBottom: "1rem" }}>
            ← Back to Home
          </button>
          <SelectQuestions
            quizId={quizId}
            selectedQuestions={selectedQuestions}
            setSelectedQuestions={setSelectedQuestions}
            onDone={handleQuestionsAssigned}
          />
        </>
      )}

      {view === "assign-students" && quizId && (
        <>
          <button onClick={() => setView("home")} style={{ marginBottom: "1rem" }}>
            ← Back to Home
          </button>
          <AssignStudents quizId={quizId} onFinish={handleFinishAssigning} />
        </>
      )}
    </div>
  );
}

export default App;
