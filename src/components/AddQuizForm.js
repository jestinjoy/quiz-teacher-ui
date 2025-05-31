import React, { useState } from "react";

const AddQuizForm = ({ onQuizCreated }) => {
  const [title, setTitle] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [totalMarks, setTotalMarks] = useState(10);
  const [startTime, setStartTime] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [randomOrder, setRandomOrder] = useState(false);
  const [creating, setCreating] = useState(false);
  const [quizEndTime, setQuizEndTime] = useState("");

  const teacherId = 1;

  const API_BASE = window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : process.env.REACT_APP_SERVER_IP;

  const handleSubmit = async () => {
    if (!title || !startTime) {
      alert("Please fill all required fields");
      return;
    }

    setCreating(true);

    const payload = {
      title,
      duration_minutes: durationMinutes,
      total_marks: totalMarks,
      start_time: new Date(startTime).toISOString(),
      quiz_end_time: quizEndTime ? new Date(quizEndTime).toISOString() : null,
      is_active: isActive,
      random_order: randomOrder,
      status: "ACTIVE",
      created_at: new Date().toISOString(),
      created_by: teacherId
    };

    try {
      const res = await fetch(`${API_BASE}/teacher/create_quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        onQuizCreated(data);

        // Reset form
        setTitle("");
        setDurationMinutes(30);
        setTotalMarks(10);
        setStartTime("");
        setQuizEndTime("");
        setIsActive(true);
        setRandomOrder(false);
      } else {
        alert("❌ Quiz creation failed");
      }
    } catch (err) {
      console.error("Quiz creation error:", err);
      alert("⚠️ Error occurred while creating quiz");
    }

    setCreating(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Create New Quiz</h2>

      <label>Title:</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", marginBottom: "1rem", width: "100%", padding: "8px" }}
      />

      <label>Total Marks:</label>
      <input
        type="number"
        value={totalMarks}
        onChange={(e) => setTotalMarks(Number(e.target.value))}
        style={{ display: "block", marginBottom: "1rem", width: "100%", padding: "8px" }}
      />

      <label>Duration (minutes):</label>
      <input
        type="number"
        value={durationMinutes}
        onChange={(e) => setDurationMinutes(Number(e.target.value))}
        style={{ display: "block", marginBottom: "1rem", width: "100%", padding: "8px" }}
      />

      <label>Start Time:</label>
      <input
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        style={{ display: "block", marginBottom: "1rem", width: "100%", padding: "8px" }}
      />

      <label>End Time (optional):</label>
      <input
        type="datetime-local"
        value={quizEndTime}
        onChange={(e) => setQuizEndTime(e.target.value)}
        style={{ display: "block", marginBottom: "1rem", width: "100%", padding: "8px" }}
      />

      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />{" "}
        Is Active
      </label>

      <label style={{ display: "block", marginBottom: "1rem" }}>
        <input
          type="checkbox"
          checked={randomOrder}
          onChange={(e) => setRandomOrder(e.target.checked)}
        />{" "}
        Randomize question order for each student
      </label>

      <button onClick={handleSubmit} disabled={creating} style={{ padding: "10px 20px" }}>
        {creating ? "Creating..." : "Create Quiz"}
      </button>
    </div>
  );
};

export default AddQuizForm;
