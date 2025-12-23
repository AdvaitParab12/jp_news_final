"use client";

import { useEffect, useRef, useState } from "react";
import {
  getNews,
  addNews,
  updateNews,
  deleteNews,
} from "@/app/admin/local-news/actions";

export default function LocalNewsAdmin() {
  const [news, setNews] = useState([]);
  const [editId, setEditId] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [preview, setPreview] = useState(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    getNews().then(setNews);
  }, []);

  // Load selected news data when editId changes
  useEffect(() => {
    if (editId) {
      const newsItem = news.find((item) => item._id === editId);
      setSelectedNews(newsItem);
      setPreview(newsItem?.image?.url || null);
    } else {
      setSelectedNews(null);
      setPreview(null);
    }
  }, [editId, news]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);

      if (editId) {
        await updateNews(editId, formData);
        setEditId(null);
      } else {
        await addNews(formData);
      }

      e.target.reset();
      setPreview(null);
      setSelectedNews(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
      setNews(await getNews());
    } catch (error) {
      console.error("Error submitting news:", error);
      alert(`Error: ${error.message || "Failed to save news article"}`);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this news article?")) {
      return;
    }
    try {
      await deleteNews(id);
      setNews(await getNews());
    } catch (error) {
      console.error("Error deleting news:", error);
      alert(`Error: ${error.message || "Failed to delete news article"}`);
    }
  }

  return (
    <div className="w-full mx-auto p-6 space-y-8">
      {/* Add / Update form */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">
          {editId ? "Update News Article" : "Add News Article"}
        </h1>
        {editId && (
          <span className="text-sm px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
            Edit mode
          </span>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Title</span>
            <input
              name="title"
              placeholder="Enter news title"
              required
              defaultValue={selectedNews?.title || ""}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Excerpt</span>
            <textarea
              name="excerpt"
              placeholder="Enter news excerpt"
              required
              defaultValue={selectedNews?.excerpt || ""}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Category
              </span>
              <input
                name="category"
                placeholder="Enter category"
                required
                defaultValue={selectedNews?.category || ""}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Date</span>
              <input
                name="date"
                type="date"
                required
                defaultValue={selectedNews?.date || ""}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Image</span>
            <input
              ref={imageInputRef}
              type="file"
              name="image"
              accept="image/*"
              className="mt-1 block w-full text-sm
                file:mr-4 file:rounded-lg file:border-0
                file:bg-blue-600 file:px-4 file:py-2
                file:text-white file:cursor-pointer
                hover:file:bg-blue-700"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setPreview(URL.createObjectURL(file));
                } else if (selectedNews?.image?.url) {
                  setPreview(selectedNews.image.url);
                } else {
                  setPreview(null);
                }
              }}
            />
          </label>

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
            className={`w-full py-2.5 rounded-xl font-medium transition ${
              editId
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {editId ? "Update News" : "Add News"}
          </button>
        </form>
      </div>

      {/* News Articles List */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
        <h2 className="text-lg font-medium text-gray-900">News Articles</h2>
        {news.length === 0 ? (
          <p className="text-sm text-gray-500">No news articles yet.</p>
        ) : (
          <div className="space-y-3">
            {news.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between gap-4 p-3 rounded-xl border hover:bg-gray-50"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {item.image?.url && (
                    <img
                      src={item.image.url}
                      alt={item.title}
                      className="h-16 w-28 object-cover rounded-lg border shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {item.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500">{item.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setEditId(item._id)}
                    className="px-3 py-1.5 text-sm rounded-lg bg-orange-400 text-yellow-800 hover:bg-orange-300 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="px-3 py-1.5 text-sm rounded-lg bg-red-600 hover:bg-red-500 text-white transition"
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
