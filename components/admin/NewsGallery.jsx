"use client";

import { useEffect, useState } from "react";
import {
  addNewsGallery,
  updateNewsGallery,
  deleteNewsGallery,
} from "@/app/admin/news-gallery/actions";

export default function NewsGalleryAdmin() {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async function load() {
      try {
        const res = await fetch("/api/news-gallery");
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load gallery:", err);
        setItems([]);
      }
    })();
  }, []);

  useEffect(() => {
    if (editId) {
      const it = items.find((i) => i._id === editId);
      setSelected(it);
    } else {
      setSelected(null);
    }
  }, [editId, items]);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = {
      title: form.get("title"),
      description: form.get("description"),
      videoUrl: form.get("videoUrl"),
      createdBy: form.get("createdBy"),
      date: form.get("date"),
    };

    try {
      if (editId) {
        await updateNewsGallery(editId, payload);
        setEditId(null);
      } else {
        await addNewsGallery(payload);
      }

      e.target.reset();

      const res = await fetch("/api/news-gallery");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error saving gallery item:", error);
      alert("Failed to save item");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this item?")) return;
    try {
      await deleteNewsGallery(id);
      const res = await fetch("/api/news-gallery");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Failed to delete item");
    }
  }

  return (
    <div className="w-full mx-auto p-6 space-y-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">
          {editId ? "Edit Gallery Item" : "Add Gallery Item"}
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Title</span>
            <input
              name="title"
              placeholder="Title"
              required
              defaultValue={selected?.title || ""}
              className="mt-1 block w-full px-3 py-2 border rounded-lg outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              Description
            </span>
            <textarea
              name="description"
              placeholder="Description"
              defaultValue={selected?.description || ""}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border rounded-lg outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              Created By
            </span>
            <input
              name="createdBy"
              placeholder="Creator name"
              defaultValue={selected?.createdBy || ""}
              className="mt-1 block w-full px-3 py-2 border rounded-lg outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Video URL</span>
            <input
              name="videoUrl"
              placeholder="https://..."
              required
              defaultValue={selected?.videoUrl || ""}
              className="mt-1 block w-full px-3 py-2 border rounded-lg outline-none"
            />
          </label>

          <div className="grid grid-cols-1 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Date</span>
              <input
                name="date"
                type="date"
                defaultValue={selected?.date || ""}
                className="mt-1 block w-full px-3 py-2 border rounded-lg outline-none"
              />
            </label>
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 rounded-xl font-medium ${
              editId ? "bg-yellow-500 text-white" : "bg-blue-600 text-white"
            }`}
          >
            {editId ? "Update Item" : "Add Item"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
        <h2 className="text-lg font-medium">Gallery Items</h2>
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">No items yet.</p>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <div
                key={it._id}
                className="flex items-center justify-between gap-4 p-3 rounded-xl border hover:bg-gray-50"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {it.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {it.description}
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
                    className="px-3 py-1.5 text-sm rounded-lg bg-orange-400 text-yellow-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(it._id)}
                    className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white"
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
