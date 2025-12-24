"use client";
import { useState, useEffect } from "react";
import { Trash2, Edit2 } from "lucide-react";

const AdminPage = () => {
  const [selectedSection, setSelectedSection] = useState(0);
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
    scrollers: {
      local: true,
      mumbai: false,
    },
  });

  // Fetch all news
  const fetchNews = async () => {
    try {
      const res = await fetch("/api/local-news");
      const data = await res.json();
      setNewsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNews();
    // Listen for any external update events
    const handleRefresh = () => fetchNews();
    window.addEventListener("newsUpdated", handleRefresh);
    return () => window.removeEventListener("newsUpdated", handleRefresh);
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScrollerChange = (e) => {
    const { name, checked } = e.target;

    setFormData((prev) => {
      const next = {
        ...prev,
        scrollers: {
          ...prev.scrollers,
          [name]: checked,
        },
      };

      // Ensure at least one checkbox stays checked
      if (!next.scrollers.local && !next.scrollers.mumbai) {
        // revert change and keep the other checked
        alert("At least one section must be selected.");
        return prev;
      }

      return next;
    });
  };

  // Handle image file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  };

  // Submit form (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.preview;

      // Upload image if selected (include image metadata)
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

      // Create payload
      const payload = {
        title: formData.title,
        excerpt: formData.description,
        image: imageUrl,
        imagePublicId: uploadedPublicId,
        imageTitle: formData.imageTitle || null,
        imageDescription: formData.imageDescription || null,
        category: formData.category,
        date: formData.date,
        createdAt: new Date().toISOString(),
      };

      // Determine targets based on checkboxes. For creates (no _id) we POST to each selected endpoint.
      const targets = [];
      if (formData.scrollers.local)
        targets.push({ url: "/api/local-news", name: "local" });
      if (formData.scrollers.mumbai)
        targets.push({ url: "/api/mumbai-news", name: "mumbai" });

      if (targets.length === 0) {
        alert("Select at least one section to publish to.");
        return;
      }

      // If editing existing item (_id present) we update only the local endpoint by default.
      // (Editing across both collections requires separate IDs.)
      if (formData._id) {
        const res = await fetch(`/api/local-news/${formData._id.toString()}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Update failed");
      } else {
        // Create in each selected section
        for (const t of targets) {
          const res = await fetch(t.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const errorData = await res
              .json()
              .catch(() => ({ error: "Unknown" }));
            throw new Error(errorData.error || `Publish to ${t.name} failed`);
          }
        }
      }

      // Reset form (default to Local selected)
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
        scrollers: { local: true, mumbai: false },
      });

      // Refresh news list
      await fetchNews();

      // Notify frontend
      window.dispatchEvent(new Event("newsUpdated"));
    } catch (err) {
      console.error("Save news error:", err);
      alert("Error: " + err.message);
    }
  };

  // Delete news
  const handleDelete = async (id) => {
    console.log("Deleting id:", id);
    if (!confirm("Are you sure you want to delete this news?")) return;
    try {
      const res = await fetch(`/api/local-news/${id}`, { method: "DELETE" });
      console.log("Delete response:", res);
      if (!res.ok) throw new Error("Delete failed");

      // Remove the deleted item from local state
      setNewsList((prev) => prev.filter((n) => n._id !== id));

      window.dispatchEvent(new Event("newsUpdated"));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error: " + err.message);
    }
  };

  // Populate form for editing
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
      scrollers: { local: true, mumbai: false },
    });
  };

  return (
    <div className="w-full mx-auto p-6 space-y-6 bg-white border border-gray-300 rounded-2xl">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
        {/* Content */}
        <div className="col-span-1 md:col-span-5">
          <div className="bg-white rounded-lg p-8 min-h-75">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <h1 className="text-2xl font-semibold text-orange-400!">
                {formData._id ? "Edit News" : "Add News"}
              </h1>

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
                  <input
                    type="text"
                    name="imageTitle"
                    value={formData.imageTitle}
                    onChange={handleChange}
                    placeholder="Image title"
                    className="w-full p-2 border border-gray-300 rounded-xl outline-orange-400"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="imageDescription"
                    value={formData.imageDescription}
                    onChange={handleChange}
                    placeholder="Optional image description"
                    className="w-full p-2 border border-gray-300 rounded-xl outline-orange-400"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter title"
                  className="w-full p-2 border border-gray-300 rounded-xl outline-orange-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Enter category"
                    className="w-full p-2 border border-gray-300 rounded-xl outline-orange-400"
                    required
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-semibold mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    required
                  />
                </div> */}
              </div>

              <div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-xl outline-orange-400"
                  required
                />
              </div>
              <div className="block border p-2 rounded-xl border-gray-300">
                <label className="block text-2xl font-bold mb-2">
                  Publish To Sections
                </label>

                <div className="flex gap-10 mt-2 ">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="local"
                      checked={!!formData.scrollers?.local}
                      onChange={handleScrollerChange}
                      className="h-6 w-6 accent-blue-500"
                    />
                    <span className="text-md font-medium mx-2">Local News</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="mumbai"
                      checked={!!formData.scrollers?.mumbai}
                      onChange={handleScrollerChange}
                      className="h-6 w-6 accent-blue-500"
                    />
                    <span className="text-md font-medium mx-2">
                      Mumbai News
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-orange-400 text-white! px-6 py-3 rounded-lg font-semibold hover:bg-orange-500 transition"
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
                        imageTitle: "",
                        imageDescription: "",
                        category: "",
                        date: "",
                        scrollers: { local: true, mumbai: false },
                      })
                    }
                    className="bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 transition"
                  >
                    Clear Form
                  </button>
                )}
              </div>
            </form>

            {/* News List */}
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4 text-orange-400!">
                All News
              </h2>
              <ul className="space-y-3">
                {newsList.map((news) => (
                  <li
                    key={news._id}
                    className="flex items-center justify-between border border-gray-300 p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-semibold">{news.title}</h4>
                        <p className="text-sm line-clamp-1 w-250">
                          {news.excerpt}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(news)}
                        className="bg-amber-400 text-white! rounded-xl p-3 h-14 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(news._id)}
                        className="bg-red-600 text-white! rounded-xl p-3 h-14 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Delete
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

export default AdminPage;
