import React, { useEffect, useState } from "react";

const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:8000"
  : process.env.REACT_APP_SERVER_IP;

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/teacher/users`)
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    fetch(`${API_BASE}/teacher/update_user/${editingUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingUser),
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ User updated!");
        setEditingUser(null);
        // Refresh user list
        return fetch(`${API_BASE}/teacher/users`)
          .then((res) => res.json())
          .then(setUsers);
      });
  };

  return (
    <div>
      <h2>👥 User List</h2>
      <input
        type="text"
        placeholder="🔍 Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
      />
      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>College</th><th>Batch</th><th>Semester</th><th>Course</th><th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.college}</td>
              <td>{u.batch}</td>
              <td>{u.semester}</td>
              <td>{u.course}</td>
              <td>
                <button onClick={() => setEditingUser({ ...u })}>✏️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editingUser && (
        <div
          style={{
            position: "fixed",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "2rem",
            zIndex: 1000,
            width: "400px",
            borderRadius: "8px",
            boxShadow: "0 0 10px #aaa",
          }}
        >
          <h3>Edit User</h3>
          {["name", "email", "password", "role", "college", "batch", "semester", "course"].map((field) => (
            <div key={field} style={{ marginBottom: "0.5rem" }}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}: </label>
              <input
                type="text"
                value={editingUser[field] || ""}
                onChange={(e) => setEditingUser({ ...editingUser, [field]: e.target.value })}
                style={{ width: "100%", padding: "0.4rem" }}
              />
            </div>
          ))}
          <button onClick={handleSave} style={{ marginRight: "1rem" }}>💾 Save</button>
          <button onClick={() => setEditingUser(null)}>❌ Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ViewUsers;
