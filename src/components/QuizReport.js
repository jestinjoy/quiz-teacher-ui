// ... existing imports
import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:8000"
  : process.env.REACT_APP_SERVER_IP;

const QuizReport = ({ quizId, onBack }) => {
  const [summary, setSummary] = useState(null);
  const [students, setStudents] = useState([]);
  const [sortField, setSortField] = useState("mark");
  const [sortOrder, setSortOrder] = useState("desc");
  const reportRef = useRef();

  useEffect(() => {
    fetch(`${API_BASE}/teacher/quiz_report/${quizId}`)
      .then((res) => res.json())
      .then((data) => {
        setSummary(data.summary);
        setStudents(data.results);
      });
  }, [quizId]);

  const sortTable = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sorted = [...students].sort((a, b) => {
      if (field === "name") {
        return order === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return order === "asc" ? a.mark - b.mark : b.mark - a.mark;
      }
    });

    setStudents(sorted);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    const data = students.map((s, index) => ({
      "Sl No": index + 1,
      "Name": s.name,
      "Mark": s.mark !== null ? s.mark : "N/A",
      "Time Taken": getTimeTaken(s.started_at, s.submitted_at)
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Quiz Report");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${summary.title.replace(/\s+/g, "_")}_Report.xlsx`);
  };

  // 🕒 Calculate time taken
  const getTimeTaken = (start, end) => {
    if (!start || !end) return "N/A";
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime;
    if (diffMs < 0) return "Invalid";

    const mins = Math.floor(diffMs / 60000);
    const secs = Math.floor((diffMs % 60000) / 1000);
    return `${mins} min ${secs} sec`;
  };

  if (!summary) return <p>Loading report...</p>;

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }} ref={reportRef}>
      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <button onClick={onBack}>← Back</button>
        <div>
          <button onClick={handlePrint} style={{ marginRight: "0.5rem" }}>🖨️ Print</button>
          <button onClick={handleExportExcel}>📥 Export Excel</button>
        </div>
      </div>

      {/* Quiz Title */}
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>{summary.title}</h2>

      {/* Summary */}
      <div style={{
        border: "1px solid #ccc", borderRadius: "10px",
        padding: "1rem", marginBottom: "2rem", backgroundColor: "#f9f9f9"
      }}>
        <p><strong>Faculty:</strong> {summary.faculty}</p>
        <p><strong>Start Time:</strong> {new Date(summary.start_time).toLocaleString()}</p>
        <p><strong>Total Marks:</strong> {summary.total_marks}</p>
        <p><strong>Students Attempted:</strong> {summary.students_attempted}</p>
        <p><strong>Maximum:</strong> {summary.maximum}</p>
        <p><strong>Minimum:</strong> {summary.minimum}</p>
        <p><strong>Average:</strong> {summary.average}</p>
        <p><strong>Median:</strong> {summary.median}</p>
      </div>

      {/* Student Table */}
      <h3>Student Scores</h3>
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#e6f0ff" }}>
          <tr>
            <th>#</th>
            <th style={{ cursor: "pointer" }} onClick={() => sortTable("name")}>
              Name {sortField === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => sortTable("mark")}>
              Mark {sortField === "mark" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th>Time Taken</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, index) => (
            <tr key={s.id} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f2f2f2" }}>
              <td>{index + 1}</td>
              <td>{s.name}</td>
              <td>{s.mark !== null ? s.mark : "N/A"}</td>
              <td>{getTimeTaken(s.started_at, s.submitted_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizReport;
