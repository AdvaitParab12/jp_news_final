"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import {
  uploadImage,
  updateImage,
  deleteImage,
} from "@/app/admin/images/actions";


export default function BottomHomeAd({ section, onImagesChange }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null); // selected image object

  const action = selected ? updateImage : uploadImage;
  const [state, formAction] = useFormState(action, { success: false });

  const loadImages = async () => {
    try {
      const res = await fetch(`/api/ad-images?section=${section}`);
      if (!res.ok) return;
      const data = await res.json();
      setImages(data);
      if (onImagesChange) onImagesChange(data.map((img) => img.url));
    } catch (err) {
      console.error("Failed to load images", err);
    }
  };

  useEffect(() => {
    loadImages();
  }, [section]);

  useEffect(() => {
    if (state.success) {
      setPreview(null);
      setSelected(null);
      if (inputRef.current) inputRef.current.value = "";
      loadImages();
    } else if (state.error) {
      alert(`Error: ${state.error}`);
    }
  }, [state]);
  return (
    <div className="w-full mx-auto p-6 space-y-8">
      {/* Upload / Update form */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">
          {selected ? "Update Slider Image" : "Upload Slider Image"}
        </h1>
        {selected && (
          <span className="text-sm px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
            Edit mode
          </span>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="section" value={section} />
          {selected && (
            <input type="hidden" name="imageId" value={selected._id} />
          )}

          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              Select Image
            </span>
            <input
              ref={inputRef}
              type="file"
              name="image"
              accept="image/*"
              required
              className="mt-1 block w-full text-sm
                file:mr-4 file:rounded-lg file:border-0
                file:bg-blue-600 file:px-4 file:py-2
                file:text-white file:cursor-pointer
                hover:file:bg-blue-700"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setPreview(URL.createObjectURL(file));
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

          {state.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {state.error}
            </div>
          )}
          <button
            type="submit"
            className={`w-full py-2.5 rounded-xl font-medium transition ${
              selected
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {selected ? "Update Image" : "Upload Image"}
          </button>
        </form>
      </div>

      {/* Uploaded Images */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Uploaded Images</h2>
        {images.length === 0 ? (
          <p className="text-sm text-gray-500">No images uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {images.map((img) => (
              <div
                key={img._id}
                className="flex items-center justify-between gap-4 p-3 rounded-xl border hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={img.url}
                    alt=""
                    className="h-16 w-28 object-cover rounded-lg border"
                  />
                  <span className="text-sm text-gray-700 truncate max-w-40">
                    {img.url.split("/").pop()}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelected(img)}
                    className="px-3 py-1.5 text-sm rounded-lg bg-orange-400 text-yellow-800 hover:bg-orange-300 transition"
                  >
                    Edit
                  </button>

                  <form
                    action={async (formData) => {
                      await deleteImage(formData);
                      loadImages();
                    }}
                  >
                    <input type="hidden" name="imageId" value={img._id} />

                    <button
                      type="submit"
                      className="px-3 py-1.5 text-sm rounded-lg bg-red-600 hover:bg-red-500 transition"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
