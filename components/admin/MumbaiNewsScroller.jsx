"use client";
import { useState, useEffect } from "react";
import { ChevronRight, Newspaper, Trash2, Edit2 } from "lucide-react";

const AdminMumbai = () => {
  const [newsList, setNewsList] = useState([]);
  const [formData, setFormData] = useState({
    _id: null,
    title: "",
    description: "",
    image: null,
    preview: null,
    imageTitle: "",
    imageDescription: "",
    category: "",
    date: "",
  });

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/mumbai-news");
      const data = await res.json();
      setNewsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNews();
    const handleRefresh = () => fetchNews();
    window.addEventListener("mumbaiNewsUpdated", handleRefresh);
    return () => window.removeEventListener("mumbaiNewsUpdated", handleRefresh);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.preview;
      let uploadedPublicId = null;

      if (formData.image) {
        const uploadData = new FormData();
        uploadData.append("file", formData.image);
        uploadData.append("title", formData.imageTitle || "");
        uploadData.append("description", formData.imageDescription || "");
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });
        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploadJson = await uploadRes.json();
        imageUrl = uploadJson.imageUrl;
        uploadedPublicId = uploadJson.publicId || null;
      }

      const method = formData._id ? "PUT" : "POST";
      const url = formData._id
        ? `/api/mumbai-news/${formData._id.toString()}`
        : "/api/mumbai-news";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          excerpt: formData.description,
          image: imageUrl,
          imagePublicId: uploadedPublicId,
          imageTitle: formData.imageTitle || null,
          imageDescription: formData.imageDescription || null,
          category: formData.category,
          date: formData.date,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      setFormData({
        _id: null,
        title: "",
        description: "",
        image: null,
        preview: null,
        imageTitle: "",
        imageDescription: "",
        category: "",
        date: "",
      });
      await fetchNews();
      window.dispatchEvent(new Event("mumbaiNewsUpdated"));
    } catch (err) {
      console.error("Save Mumbai news error:", err);
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this news?")) return;
    try {
      const res = await fetch(`/api/mumbai-news/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setNewsList((prev) => prev.filter((n) => n._id !== id));
      window.dispatchEvent(new Event("mumbaiNewsUpdated"));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error: " + err.message);
    }
  };

  const handleEdit = (news) => {
    setFormData({
      _id: news._id,
      title: news.title,
      description: news.excerpt,
      image: null,
      preview: news.image,
      imageTitle: news.image?.title || "",
      imageDescription: news.image?.description || "",
      category: news.category || "",
      date: news.date || "",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
        <div className="col-span-1 md:col-span-5 ">
          <div className="bg-white rounded-lg p-8 shadow-sm border min-h-75 ">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {formData._id ? "Edit Mumbai News" : "Add Mumbai News"}
              </h2>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm"
                />
                {formData.preview && (
                  <img
                    src={formData.preview}
                    alt="Preview"
                    className="mt-4 h-40 w-full max-w-sm object-cover rounded-lg border"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Image Title
                  </label>
                  <input
                    type="text"
                    name="imageTitle"
                    value={formData.imageTitle}
                    onChange={handleChange}
                    placeholder="Image title"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Image Description
                  </label>
                  <input
                    type="text"
                    name="imageDescription"
                    value={formData.imageDescription}
                    onChange={handleChange}
                    placeholder="Optional image description"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter title"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Enter category"
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg"
                >
                  {formData._id ? "Update News" : "Save News"}
                </button>
                {formData._id && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        _id: null,
                        title: "",
                        description: "",
                        image: null,
                        preview: null,
                      })
                    }
                    className="bg-gray-400 text-white px-6 py-3 rounded-lg"
                  >
                    Clear Form
                  </button>
                )}
              </div>
            </form>

            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4">All Mumbai News</h2>
              <ul className="space-y-3">
                {newsList.map((news) => (
                  <li
                    key={news._id}
                    className="flex items-center justify-between border p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-semibold">{news.title}</h4>
                        <p
                          className="text-sm"
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "18rem",
                          }}
                        >
                          {news.excerpt}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(news)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(news._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              {newsList.length === 0 && <p>No news yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMumbai;
