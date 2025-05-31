import React, { useState, useEffect } from "react";

const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:8000"
  : process.env.REACT_APP_SERVER_IP;

const AssignStudents = ({ quizId, onFinish }) => {
  const [students, setStudents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [semesterFilter, setSemesterFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      let url = `${API_BASE}/teacher/students`;
      const params = [];

      if (semesterFilter !== "") params.push(`semester=${parseInt(semesterFilter)}`);
      if (batchFilter !== "") params.push(`batch=${parseInt(batchFilter)}`);

      if (params.length) url += `?${params.join("&")}`;

      console.log("Fetching students from:", url); // 🔍 Debug line

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          console.error("Unexpected response:", data);
          setStudents([]);
        }
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setStudents([]);
      }
    };

    fetchStudents();
  }, [semesterFilter, batchFilter]);

  const toggleStudent = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one student.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/teacher/assign_students/${quizId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_ids: selectedIds }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.detail || "Assignment failed");
      }

      alert(result.message);
      onFinish();
    } catch (err) {
      console.error("Error assigning students:", err);
      alert("Error: " + err.message);
      setSubmitting(false);
    }
  };

  const selectAll = () => {
    setSelectedIds(students.map((s) => s.id));
  };

  const clearAll = () => {
    setSelectedIds([]);
  };

  return (
    <div>
      <h2>Assign Students to Quiz #{quizId}</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>Semester: </label>
        <select value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)}>
          <option value="">All</option>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>

        <label style={{ marginLeft: "1rem" }}>Year: </label>
        <select value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)}>
          <option value="">All</option>
          {Array.from({ length: 10 }, (_, i) => 2021 + i).map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <button onClick={selectAll} style={{ marginLeft: "1rem" }}>Select All</button>
        <button onClick={clearAll} style={{ marginLeft: "0.5rem" }}>Clear All</button>
      </div>

      {students.length === 0 ? (
        <p>No students found for the selected filters.</p>
      ) : (
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
      )}

      <button onClick={handleAssign} disabled={submitting}>
        {submitting ? "Assigning..." : "Assign Selected Students"}
      </button>
    </div>
  );
};

export default AssignStudents;
