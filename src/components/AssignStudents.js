import React, { useState, useEffect } from "react";

const AssignStudents = ({ quizId, onFinish }) => {
  const [students, setStudents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [submitting, setSubmitting] = useState(false); // ✅ NEW STATE

  useEffect(() => {
    fetch("http://localhost:8000/teacher/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Failed to fetch students:", err));
  }, []);

  const toggleStudent = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    setSubmitting(true); // ✅ disable button immediately
    try {
      const res = await fetch(`http://localhost:8000/teacher/assign_students/${quizId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_ids: selectedIds }),
      });
      if (!res.ok) throw new Error("Failed to assign students");
      onFinish();
    } catch (err) {
      console.error("Error assigning students:", err);
      setSubmitting(false); // ❌ re-enable if error
    }
  };

  return (
    <div>
      <h2>Assign Students to Quiz #{quizId}</h2>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {students.map((s) => (
          <li key={s.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedIds.includes(s.id)}
                onChange={() => toggleStudent(s.id)}
              />
              {s.name} (ID: {s.id})
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleAssign} disabled={submitting}>
        {submitting ? "Assigning..." : "Assign Selected Students"}
      </button>
    </div>
  );
};

export default AssignStudents;
