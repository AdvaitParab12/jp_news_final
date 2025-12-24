"use client";

import React, { useEffect, useState, useRef } from "react";

function Badge({ children }) {
  return (
    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
      {children}
    </span>
  );
}

export default function AdminPage() {
  const [photos, setPhotos] = useState([]);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(null);
  const fileInputRef = useRef(null);
  const PER_PAGE = 12;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(photos.length / PER_PAGE);

  const paginatedPhotos = photos.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages || 1);
  }, [photos, totalPages]);
  async function fetchPhotos() {
    try {
      const res = await fetch("/api/photos", { cache: "no-store" });
      const data = await res.json();
      console.log("Fetched photos:", data);
      setPhotos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  function handleFiles(e) {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!files.length) return setMessage("Select images to upload");
    setLoading(true);
    setMessage("");
    try {
      for (const file of files) {
        const form = new FormData();
        form.append("file", file);
        form.append("title", file.name);
        form.append("alt", file.name);

        const res = await fetch("/api/uploadPhotosGallery", {
          method: "POST",
          body: form,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Upload failed");
        }
      }
      setMessage("Upload successful");
      setFiles([]);
      setPreviews([]);
      fetchPhotos();
      setPage(1);
    } catch (err) {
      console.error(err);
      setMessage(String(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(photo) {
    if (!confirm("Delete this image?")) return;
    try {
      const res = await fetch("/api/photos", {
        method: "DELETE",
        body: JSON.stringify({ id: photo._id }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.ok) {
        setPhotos((p) => p.filter((x) => String(x._id) !== String(photo._id)));
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert(String(err));
    }
  }

  // async function saveEdit(id, title, alt) {
  //   try {
  //     const res = await fetch("/api/photos", {
  //       method: "PATCH",
  //       body: JSON.stringify({ id, title, alt }),
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     const data = await res.json();
  //     if (data.ok) {
  //       setPhotos((list) =>
  //         list.map((p) => (String(p._id) === String(id) ? data.doc : p))
  //       );
  //       setEditing(null);
  //     } else {
  //       alert(data.error || "Update failed");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert(String(err));
  //   }
  // }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-full mx-auto border border-gray-300 p-10 rounded-xl">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-orange-400!">
              Photos Gallery{" "}
            </h1>
          </div>
        </header>

        <section className="bg-white p-6 rounded mb-8">
          <h2 className="text-lg font-semibold mb-4">Upload Images</h2>
          <form onSubmit={handleUpload} className="">
            <div className="flex items-center gap-4 mb-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-orange-400 text-white! rounded hover:bg-amber-400/90 hover:scale-105"
              >
                Select Images
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-400 text-white! rounded hover:bg-amber-400/90 hover:scale-105"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
              <span className="text-sm text-slate-500">{message}</span>
            </div>

            {previews.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {previews.map((p, i) => (
                  <div
                    key={i}
                    className="w-28 h-20 overflow-hidden rounded border"
                  >
                    <img
                      src={p}
                      className="w-full h-full object-cover"
                      alt={`preview-${i}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </form>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {paginatedPhotos.map((p) => (
              <div key={p._id} className="bg-white rounded shadow p-2">
                <div className="w-full h-36 bg-slate-100 mb-2 overflow-hidden rounded">
                  <img
                    src={p.url}
                    alt={p.alt || p.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-sm mb-2 truncate">
                  {p.title || "Untitled"}
                </div>
                <div className="flex gap-2">
                  {/* <button
                    onClick={() => setEditing(p._id)}
                    className="flex-1 px-2 py-1 bg-amber-500 text-white rounded"
                  >
                    Edit
                  </button> */}
                  <button
                    onClick={() => handleDelete(p)}
                    className="flex-1 px-2 py-1 bg-red-500 text-white! rounded"
                  >
                    Delete
                  </button>
                </div>

                {editing === p._id && (
                  <div className="mt-3 border-t pt-3">
                    <input
                      defaultValue={p.title}
                      placeholder="Title"
                      className="w-full mb-2 px-2 py-1 border rounded"
                      id={`title-${p._id}`}
                    />
                    <input
                      defaultValue={p.alt}
                      placeholder="Alt text"
                      className="w-full mb-2 px-2 py-1 border rounded"
                      id={`alt-${p._id}`}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          saveEdit(
                            p._id,
                            document.getElementById(`title-${p._id}`).value,
                            document.getElementById(`alt-${p._id}`).value
                          )
                        }
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="px-3 py-1 bg-slate-200 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-orange-400 text-white! rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-md text-slate-600">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-orange-400 text-white! rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
