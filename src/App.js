import React, { useState, useEffect } from "react";
import AddQuestionForm from "./components/AddQuestionForm";
import AddQuizForm from "./components/AddQuizForm";
import SelectQuestions from "./components/SelectQuestions";
import AssignStudents from "./components/AssignStudents";
import QuizList from "./components/QuizList";
import BulkUpload from "./components/BulkUpload";
import ViewQuestions from "./components/ViewQuestions";
import AddUserForm from "./components/AddUserForm";
import BulkUploadUsers from "./components/BulkUploadUsers";
import LoginForm from "./components/LoginForm";
import ManageCategories from "./components/ManageCategories"; // ✅ NEW IMPORT

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("home");
  const [quizId, setQuizId] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // ✅ Restore login from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("adminUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem("adminUser", JSON.stringify(loggedInUser));
    setView("home");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("adminUser");
  };

  const handleQuizCreated = (quiz) => {
    setQuizId(quiz.id);
    setView("select-questions");
  };

  const handleQuestionsAssigned = () => setView("assign-students");

  const handleFinishAssigning = () => {
    alert("✅ Quiz setup complete!");
    setQuizId(null);
    setSelectedQuestions([]);
    setView("home");
  };

  const isAdmin = user?.id === 1 && user?.role?.toLowerCase() === "teacher";

  if (!user) return <LoginForm onLogin={handleLogin} />;

  if (!isAdmin) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", fontSize: "1.2rem" }}>
        <h2>🚫 Access Denied</h2>
        <p>This dashboard is only for the admin (user ID = 1, role = teacher).</p>
      </div>
    );
  }

  return (
    <div className="App" style={{ padding: "1rem", maxWidth: "900px", margin: "auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h1>👩‍🏫 Admin Dashboard</h1>
        <div>
          <span style={{ marginRight: "1rem" }}><strong>{user.name}</strong></span>
          <button onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>

      {/* Home Menu */}
      {view === "home" && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          <button onClick={() => setView("add-question")}>➕ Add Question</button>
          <button onClick={() => setView("add-quiz")}>📝 Add Quiz</button>
          <button onClick={() => setView("view-quizzes")}>📊 View Quizzes</button>
          <button onClick={() => setView("view-questions")}>📋 View Questions</button>
          <button onClick={() => setView("bulk-upload")}>📁 Bulk Upload Questions</button>
          <button onClick={() => setView("add-user")}>👤 Add User</button>
          <button onClick={() => setView("bulk-upload-users")}>📥 Bulk Upload Users</button>
          <button onClick={() => setView("manage-categories")}>🗂️ Manage Categories</button>
        </div>
      )}

      {/* Views */}
      {view === "add-question" && (
        <>
          <button onClick={() => setView("home")} style={{ margin: "1rem 0" }}>← Back</button>
          <AddQuestionForm />
        </>
      )}
      {view === "add-quiz" && (
        <>
          <button onClick={() => setView("home")} style={{ margin: "1rem 0" }}>← Back</button>
          <AddQuizForm onQuizCreated={handleQuizCreated} />
        </>
      )}
      {view === "view-quizzes" && (
        <>
          <button onClick={() => setView("home")} style={{ margin: "1rem 0" }}>← Back</button>
          <QuizList />
        </>
      )}
      {view === "view-questions" && (
        <>
          <button onClick={() => setView("home")} style={{ margin: "1rem 0" }}>← Back</button>
          <ViewQuestions />
        </>
      )}
      {view === "bulk-upload" && (
        <>
          <BulkUpload onBack={() => setView("home")} />
        </>
      )}
      {view === "add-user" && (
        <>
          <button onClick={() => setView("home")} style={{ margin: "1rem 0" }}>← Back</button>
          <AddUserForm />
        </>
      )}
      {view === "bulk-upload-users" && (
        <>
          <BulkUploadUsers onBack={() => setView("home")} />
        </>
      )}
      {view === "select-questions" && quizId && (
        <>
          <button onClick={() => setView("home")} style={{ margin: "1rem 0" }}>← Back</button>
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
          <button onClick={() => setView("home")} style={{ margin: "1rem 0" }}>← Back</button>
          <AssignStudents quizId={quizId} onFinish={handleFinishAssigning} />
        </>
      )}
      {view === "manage-categories" && (
        <>
          <button onClick={() => setView("home")} style={{ margin: "1rem 0" }}>← Back</button>
          <ManageCategories />
        </>
      )}
    </div>
  );
}

export default App;
