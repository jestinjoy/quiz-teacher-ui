import React, { useState } from "react";
import AddQuestionForm from "./components/AddQuestionForm";
import SelectQuestions from "./components/SelectQuestions";

function App() {
  const [view, setView] = useState("home");
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  return (
    <div className="App" style={{ padding: "1rem", maxWidth: "800px", margin: "auto" }}>
      {view === "home" && (
        <>
          <h1>Teacher Dashboard</h1>
          <button onClick={() => setView("add-question")} style={{ marginRight: "1rem" }}>
            Add Question
          </button>
          <button onClick={() => setView("select-questions")}>Add Quiz</button>
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

      {view === "select-questions" && (
        <>
          <button onClick={() => setView("home")} style={{ marginBottom: "1rem" }}>
            ← Back to Home
          </button>
          <SelectQuestions
            selectedQuestions={selectedQuestions}
            setSelectedQuestions={setSelectedQuestions}
          />
        </>
      )}
    </div>
  );
}

export default App;
