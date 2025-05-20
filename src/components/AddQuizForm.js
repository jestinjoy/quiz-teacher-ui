import React, { useState } from "react";

const AddQuizForm = ({ onQuizCreated }) => {
  const [title, setTitle] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [totalMarks, setTotalMarks] = useState(10);
  const [startTime, setStartTime] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [creating, setCreating] = useState(false);

  const teacherId = 1;

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
      is_active: isActive,
      status: "ACTIVE", // Hardcoded
      created_at: new Date().toISOString(),
      created_by: teacherId
    };

    const res = await fetch("http://localhost:8000/teacher/create_quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      onQuizCreated(data);

      // Reset
      setTitle("");
      setDurationMinutes(30);
      setTotalMarks(10);
      setStartTime("");
      setIsActive(true);
    } else {
      alert("Quiz creation failed");
    }

    setCreating(false);
  };

  return (
    <div>
      <h2>Create New Quiz</h2>

      <label>Title:</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", marginBottom: "1rem", width: "100%" }}
      />

      <label>Total Marks:</label>
      <input
        type="number"
        value={totalMarks}
        onChange={(e) => setTotalMarks(Number(e.target.value))}
        style={{ display: "block", marginBottom: "1rem", width: "100%" }}
      />

      <label>Duration (minutes):</label>
      <input
        type="number"
        value={durationMinutes}
        onChange={(e) => setDurationMinutes(Number(e.target.value))}
        style={{ display: "block", marginBottom: "1rem", width: "100%" }}
      />

      <label>Start Time:</label>
      <input
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        style={{ display: "block", marginBottom: "1rem", width: "100%" }}
      />

      <label>
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        {" "}Is Active
      </label>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleSubmit} disabled={creating}>
          {creating ? "Creating..." : "Create Quiz"}
        </button>
      </div>
    </div>
  );
};

export default AddQuizForm;
