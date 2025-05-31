import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:8000"
  : process.env.REACT_APP_SERVER_IP;


export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [newSub, setNewSub] = useState({});
  const [editingSub, setEditingSub] = useState({});

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/teacher/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("❌ Failed to load categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await axios.post(`${API_BASE}/teacher/category`, { name: newCategory });
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      alert("❌ Failed to add category");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`${API_BASE}/teacher/category/${id}`);
      fetchCategories();
    } catch (err) {
      alert("❌ Failed to delete category");
    }
  };

  const updateCategory = async (id) => {
    try {
      await axios.put(`${API_BASE}/teacher/category/${id}`, { name: editingCategoryName });
      setEditingCategoryId(null);
      setEditingCategoryName("");
      fetchCategories();
    } catch (err) {
      alert("❌ Failed to update category");
    }
  };

  const addSubcategory = async (categoryId) => {
    const name = newSub[categoryId];
    if (!name?.trim()) return;
    try {
      await axios.post(`${API_BASE}/teacher/subcategory`, {
        name,
        category_id: categoryId
      });
      setNewSub({ ...newSub, [categoryId]: "" });
      fetchCategories();
    } catch (err) {
      alert("❌ Failed to add subcategory");
    }
  };

  const updateSubcategory = async (subId) => {
    const name = editingSub[subId];
    try {
      await axios.put(`${API_BASE}/teacher/subcategory/${subId}`, { name });
      setEditingSub({ ...editingSub, [subId]: undefined });
      fetchCategories();
    } catch (err) {
      alert("❌ Failed to update subcategory");
    }
  };

  const deleteSubcategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subcategory?")) return;
    try {
      await axios.delete(`${API_BASE}/teacher/subcategory/${id}`);
      fetchCategories();
    } catch (err) {
      alert("❌ Failed to delete subcategory");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "1rem" }}>
      <h2>📂 Manage Categories & Subcategories</h2>

      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <input
          type="text"
          value={newCategory}
          placeholder="New category name"
          onChange={(e) => setNewCategory(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        />
        <button onClick={addCategory} style={{ marginLeft: "1rem" }}>➕ Add Category</button>
      </div>

      {categories.map((cat) => (
        <div key={cat.id} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
          {/* Category Header */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            {editingCategoryId === cat.id ? (
              <>
                <input
                  value={editingCategoryName}
                  onChange={(e) => setEditingCategoryName(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button onClick={() => updateCategory(cat.id)}>💾</button>
                <button onClick={() => setEditingCategoryId(null)}>❌</button>
              </>
            ) : (
              <>
                <strong style={{ flex: 1 }}>{cat.name}</strong>
                <button onClick={() => {
                  setEditingCategoryId(cat.id);
                  setEditingCategoryName(cat.name);
                }}>✏️</button>
                <button onClick={() => deleteCategory(cat.id)} style={{ marginLeft: "0.5rem" }}>🗑️</button>
              </>
            )}
          </div>

          {/* Subcategory List */}
          <ul style={{ paddingLeft: "1.5rem" }}>
            {cat.subcategories?.map((sub) => (
              <li key={sub.id} style={{ marginBottom: "4px" }}>
                {editingSub[sub.id] !== undefined ? (
                  <>
                    <input
                      value={editingSub[sub.id]}
                      onChange={(e) => setEditingSub({ ...editingSub, [sub.id]: e.target.value })}
                    />
                    <button onClick={() => updateSubcategory(sub.id)}>💾</button>
                    <button onClick={() => setEditingSub({ ...editingSub, [sub.id]: undefined })}>❌</button>
                  </>
                ) : (
                  <>
                    {sub.name}
                    <button onClick={() => setEditingSub({ ...editingSub, [sub.id]: sub.name })} style={{ marginLeft: "0.5rem" }}>✏️</button>
                    <button onClick={() => deleteSubcategory(sub.id)} style={{ marginLeft: "0.5rem" }}>🗑️</button>
                  </>
                )}
              </li>
            ))}
          </ul>

          {/* Add Subcategory Input */}
          <div style={{ display: "flex", marginTop: "0.5rem" }}>
            <input
              type="text"
              placeholder="New subcategory"
              value={newSub[cat.id] || ""}
              onChange={(e) => setNewSub({ ...newSub, [cat.id]: e.target.value })}
              style={{ flex: 1, padding: "6px" }}
            />
            <button onClick={() => addSubcategory(cat.id)} style={{ marginLeft: "1rem" }}>➕ Add</button>
          </div>
        </div>
      ))}
    </div>
  );
}
