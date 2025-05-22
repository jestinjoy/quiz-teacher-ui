import React, { useState } from "react";

const AddUserForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    college: "",
    batch: "",
    semester: ""
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const res = await fetch("http://localhost:8000/teacher/add_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert("✅ User added successfully!");
      setForm({
        name: "", email: "", password: "", role: "student",
        college: "", batch: "", semester: ""
      });
    } else {
      const err = await res.json();
      alert("❌ " + (err.detail || "Failed to add user"));
    }
    setSubmitting(false);
  };

  return (
    <div>
      <h2>Add New User</h2>

      {["name", "email", "password", "college", "batch", "semester"].map((field) => (
        <div key={field} style={{ marginBottom: "1rem" }}>
          <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
          <input
            type={field === "password" ? "password" : "text"}
            name={field}
            value={form[field]}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
      ))}

      <div style={{ marginBottom: "1rem" }}>
        <label>Role:</label>
        <select name="role" value={form.role} onChange={handleChange} style={{ width: "100%", padding: "8px" }}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>

      <button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Adding..." : "Add User"}
      </button>
    </div>
  );
};

export default AddUserForm;
