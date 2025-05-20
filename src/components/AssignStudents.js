import React, { useState, useEffect } from "react";

const AssignStudents = ({ quizId, onFinish }) => {
  const [students, setStudents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/teacher/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => {
        console.error("Failed to fetch students:", err);
        setMessage("⚠️ Failed to load students.");
      });
  }, []);

  const toggleStudent = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (submitting || selectedIds.length === 0) {
      setMessage("⚠️ Please select at least one student.");
      return;
    }

    setSubmitting(true);
    setMessage("Assigning students...");

    try {
      const res = await fetch(`http://localhost:8000/teacher/assign_students/${quizId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_ids: selectedIds }),
      });

      if (!res.ok) throw new Error("Failed to assign students");

      setMessage("✅ Students assigned successfully.");
      setTimeout(() => onFinish(), 1500); // Go to home after 1.5 seconds
    } catch (err) {
      console.error("Error assigning students:", err);
      setMessage("❌ Error assigning students.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Assign Students to Quiz #{quizId}</h2>

      <ul>
        {students.map((s) => (
          <li key={s.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedIds.includes(s.id)}
                onChange={() => toggleStudent(s.id)}
                disabled={submitting}
              />
              {s.name} (ID: {s.id})
            </label>
          </li>
        ))}
      </ul>

      <button onClick={handleAssign} disabled={submitting}>
        {submitting ? "Assigning..." : "Assign Selected Students"}
      </button>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
};

export default AssignStudents;
