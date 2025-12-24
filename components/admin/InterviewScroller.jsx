"use client";

import { useEffect, useRef, useState } from "react";
import {
  addInterview,
  updateInterview,
  deleteInterview,
} from "@/app/admin/interviews/actions";

export default function InterviewAdmin() {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    (async function load() {
      try {
        const res = await fetch("/api/interviews");
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load interviews:", err);
        setItems([]);
      }
    })();
  }, []);

  useEffect(() => {
    if (editId) {
      const it = items.find((i) => i._id === editId);
      setSelected(it);
      setPreview(it?.thumbnail?.url || null);
    } else {
      setSelected(null);
      setPreview(null);
    }
  }, [editId, items]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);

      if (editId) {
        await updateInterview(editId, formData);
        setEditId(null);
      } else {
        await addInterview(formData);
      }

      e.target.reset();
      setPreview(null);
      setSelected(null);
      if (fileRef.current) fileRef.current.value = "";

      // refresh list from API
      try {
        const res = await fetch("/api/interviews");
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to refresh interviews after submit:", err);
      }
    } catch (error) {
      console.error("Error submitting interview:", error);
      alert(`Error: ${error.message || "Failed to save interview"}`);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this interview?")) return;
    try {
      await deleteInterview(id);

      // refresh list from API
      try {
        const res = await fetch("/api/interviews");
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to refresh interviews after delete:", err);
      }
    } catch (error) {
      console.error("Error deleting interview:", error);
      alert(`Error: ${error.message || "Failed to delete"}`);
    }
  }

  return (
    <div className=" w-full mx-auto p-6 space-y-8 border rounded-xl border-gray-300">
      <div className="flex items-center gap-3  ">
        <h1 className="text-2xl font-semibold text-orange-400!">
          {editId ? "Edit Interview" : "Add Interview"}
        </h1>
        {editId && (
          <span className="text-sm px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
            Edit mode
          </span>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <label className="block">
            <input
              name="title"
              placeholder="Title"
              required
              defaultValue={selected?.title || ""}
              className="w-full p-2 border border-gray-300 rounded-xl outline-orange-400"
            />
          </label>

          <label className="block">
            <textarea
              name="excerpt"
              placeholder="Excerpt"
              defaultValue={selected?.excerpt || ""}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-xl outline-orange-400"
            />
          </label>

          <label className="block">
            <input
              name="createdBy"
              placeholder="Creator name"
              defaultValue={selected?.createdBy || ""}
              className="w-full p-2 border border-gray-300 rounded-xl outline-orange-400"
            />
          </label>

          <label className="block">
            <input
              name="videoUrl"
              placeholder="Video URL"
              required
              defaultValue={selected?.videoUrl || ""}
              className="w-full p-2 border border-gray-300 rounded-xl outline-orange-400"
            />
          </label>

          <div className="grid grid-cols-1 gap-4">
            {/* <label className="block">
              <span className="text-sm font-medium text-gray-700">Date</span>
              <input
                name="date"
                type="date"
                defaultValue={selected?.date || ""}
                className="mt-1 block w-full px-3 py-2 border rounded-lg outline-none"
              />
            </label> */}

            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Thumbnail
              </span>
              <input
                ref={fileRef}
                type="file"
                name="thumbnail"
                accept="image/*"
                className="mt-1 block w-full text-sm file:mr-4 file:rounded-lg file:bg-orange-500 file:px-4 file:py-2 file:text-white"
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (f) setPreview(URL.createObjectURL(f));
                  else setPreview(selected?.thumbnail?.url || null);
                }}
              />
            </label>
          </div>

          {preview && (
            <div className="border rounded-xl p-3 bg-gray-50">
              <p className="text-xs text-gray-500 mb-2">Preview</p>
              <img
                src={preview}
                alt="Preview"
                className="rounded-lg max-h-60 object-contain mx-auto"
              />
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-2.5 rounded-xl font-medium ${
              editId ? "bg-yellow-500 text-white!" : "bg-orange-400 text-white!"
            }`}
          >
            {editId ? "Update Interview" : "Add Interview"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-medium text-orange-400!">Interviews List</h2>
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">No interviews yet.</p>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <div
                key={it._id}
                className="flex items-center justify-between gap-4 p-3 rounded-xl border border-gray-300 hover:bg-gray-50"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {it.thumbnail?.url && (
                    <img
                      src={it.thumbnail?.url}
                      alt={it.title}
                      className="h-16 w-28 object-cover rounded-lg border shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {it.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 truncate w-250">
                      {it.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{it.date}</span>
                      {it.createdBy && (
                        <span className="text-xs text-gray-500">
                          • {it.createdBy}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setEditId(it._id)}
                    className="px-3 py-1.5 text-sm rounded-lg bg-orange-400 text-white!"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(it._id)}
                    className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white!"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
