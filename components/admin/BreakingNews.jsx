"use client";

import { useEffect, useState } from "react";
import {
  getBreakingNews,
  addBreakingNews,
  updateBreakingNews,
  deleteBreakingNews,
} from "@/app/admin/breaking-news/actions";

export default function BreakingNewsAdmin() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [href, setHref] = useState("");
  const [editingId, setEditingId] = useState(null);

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await getBreakingNews();
      setNews(data || []);
    } catch (error) {
      console.error("Error loading breaking news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const resetForm = () => {
    setCategory("");
    setTitle("");
    setHref("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const payload = {
        category,
        title,
        href,
      };

      if (editingId !== null) {
        await updateBreakingNews(editingId, payload);
      } else {
        await addBreakingNews(payload);
      }
      resetForm();
      // Reload news to get the latest data
      await loadNews();
    } catch (error) {
      console.error("Error saving breaking news:", error);
      alert("Failed to save breaking news. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setCategory(item.category);
    setTitle(item.title);
    setHref(item.href);
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this breaking news?")) {
      return;
    }

    try {
      setLoading(true);
      await deleteBreakingNews(id);
      // Reload news to get the latest data
      await loadNews();
    } catch (error) {
      console.error("Error deleting breaking news:", error);
      alert("Failed to delete breaking news. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6 space-y-6 bg-white border rounded-2xl">
      <h1 className="text-2xl font-semibold">Breaking News</h1>

      <form onSubmit={handleSubmit} className="space-y-3 flex flex-col gap-3">
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded-xl"
          placeholder="Category"
          required
        />

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={3}
          className="w-full p-3 border rounded-xl"
          placeholder="Title"
          required
        />

        <input
          value={href}
          onChange={(e) => setHref(e.target.value)}
          className="w-full p-2 border rounded-xl"
          placeholder="Link(optional)"
        />

        <button 
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : editingId !== null ? "Update" : "Add"}
        </button>
      </form>

      <div className="space-y-3">
        {loading && news.length === 0 && (
          <p className="text-center text-gray-500">Loading...</p>
        )}
        {!loading && news.length === 0 && (
          <p className="text-center text-gray-500">No breaking news items yet.</p>
        )}
        {news.map((item, index) => (
          <div
            key={item._id}
            className="flex justify-between p-3 border rounded-xl"
          >
            <div>
              <p className="text-md">{item.category}</p>
              <p>{item.title}</p>
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={() => handleEdit(item)}
                disabled={loading}
                className="bg-amber-400 rounded-xl p-3 h-14 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                disabled={loading}
                className="bg-red-600 rounded-xl p-3 h-14 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
