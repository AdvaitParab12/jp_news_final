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
    source: "local",
  });

  // Fetch all news and merge duplicates
  const fetchNews = async () => {
    try {
      const [lr, mr] = await Promise.all([
        fetch("/api/local-news").catch(() => null),
        fetch("/api/mumbai-news").catch(() => null),
      ]);

      const localList = lr && lr.ok ? await lr.json() : [];
      const mumbaiList = mr && mr.ok ? await mr.json() : [];

      // Create a map of items by title+excerpt to detect duplicates
      const itemMap = new Map();

      // Add local items
      if (Array.isArray(localList)) {
        localList.forEach((item) => {
          const key = `${(item.title || "").trim()}||${(
            item.excerpt || ""
          ).trim()}`;
          if (!itemMap.has(key)) {
            itemMap.set(key, {
              ...item,
              sources: ["local"],
              localId: item._id,
              localItem: item,
            });
          } else {
            const existing = itemMap.get(key);
            existing.sources.push("local");
            existing.localId = item._id;
            existing.localItem = item;
          }
        });
      }

      // Add mumbai items
      if (Array.isArray(mumbaiList)) {
        mumbaiList.forEach((item) => {
          const key = `${(item.title || "").trim()}||${(
            item.excerpt || ""
          ).trim()}`;
          if (!itemMap.has(key)) {
            itemMap.set(key, {
              ...item,
              sources: ["mumbai"],
              mumbaiId: item._id,
              mumbaiItem: item,
            });
          } else {
            const existing = itemMap.get(key);
            if (!existing.sources.includes("mumbai")) {
              existing.sources.push("mumbai");
            }
            existing.mumbaiId = item._id;
            existing.mumbaiItem = item;
          }
        });
      }

      // Convert map to sorted array
      const merged = Array.from(itemMap.values()).sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      });

      setNewsList(merged);
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

      // If editing existing item (_id present) send PUT to the correct source endpoint.
      if (formData._id) {
        const endpoint =
          formData.source === "mumbai" ? "/api/mumbai-news" : "/api/local-news";
        const res = await fetch(`${endpoint}/${formData._id.toString()}`, {
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
        source: "local",
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

  // Delete news with support for merged items
  const handleDelete = async (news) => {
    try {
      const hasLocal = news.sources?.includes("local");
      const hasMumbai = news.sources?.includes("mumbai");

      // If item exists in both sections, ask which to delete from
      if (hasLocal && hasMumbai) {
        const choice = prompt(
          "Delete from:\n1 - Local News\n2 - Mumbai News\n3 - Both\n\nEnter 1, 2 or 3",
          "1"
        );
        if (!choice) return;

        if (!confirm("Are you sure you want to delete the selected items?"))
          return;

        const doLocal = choice === "1" || choice === "3";
        const doMumbai = choice === "2" || choice === "3";

        if (doLocal && news.localId) {
          const lr = await fetch(`/api/local-news/${news.localId}`, {
            method: "DELETE",
          });
          if (!lr.ok) {
            const err = await lr.json().catch(() => ({}));
            throw new Error(err.error || "Local delete failed");
          }
        }

        if (doMumbai && news.mumbaiId) {
          const mr = await fetch(`/api/mumbai-news/${news.mumbaiId}`, {
            method: "DELETE",
          });
          if (!mr.ok) {
            const err = await mr.json().catch(() => ({}));
            throw new Error(err.error || "Mumbai delete failed");
          }
        }

        await fetchNews();
        window.dispatchEvent(new Event("newsUpdated"));
        return;
      }

      // Item exists in only one section - delete directly
      const confirmMsg = hasLocal
        ? "Delete this news from Local News?"
        : "Delete this news from Mumbai News?";

      if (!confirm(confirmMsg)) return;

      if (hasLocal && news.localId) {
        const lr = await fetch(`/api/local-news/${news.localId}`, {
          method: "DELETE",
        });
        if (!lr.ok) {
          const err = await lr.json().catch(() => ({}));
          throw new Error(err.error || "Local delete failed");
        }
      } else if (hasMumbai && news.mumbaiId) {
        const mr = await fetch(`/api/mumbai-news/${news.mumbaiId}`, {
          method: "DELETE",
        });
        if (!mr.ok) {
          const err = await mr.json().catch(() => ({}));
          throw new Error(err.error || "Mumbai delete failed");
        }
      }

      await fetchNews();
      window.dispatchEvent(new Event("newsUpdated"));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error: " + err.message);
    }
  };

  // Populate form for editing (prioritize local, fallback to mumbai)
  const handleEdit = (news) => {
    const sourceItem = news.localItem || news.mumbaiItem;
    const source = news.sources?.includes("local") ? "local" : "mumbai";
    setFormData({
      _id: source === "mumbai" ? news.mumbaiId : news.localId,
      title: news.title,
      description: news.excerpt,
      image: null,
      preview: news.image,
      imageTitle: sourceItem?.image?.title || "",
      imageDescription: sourceItem?.image?.description || "",
      category: news.category || "",
      date: news.date || "",
      scrollers: {
        local: news.sources?.includes("local"),
        mumbai: news.sources?.includes("mumbai"),
      },
      source: source,
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
                        source: "local",
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
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{news.title}</h4>
                          <div className="flex gap-1">
                            {news.sources?.includes("local") && (
                              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                                Local
                              </span>
                            )}
                            {news.sources?.includes("mumbai") && (
                              <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                                Mumbai
                              </span>
                            )}
                          </div>
                        </div>
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
                        onClick={() => handleDelete(news)}
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
