"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import {
  getStaticAdImage,
  uploadOrUpdateStaticAd,
} from "@/app/admin/static-ad/actions";

export default function StaticAdAdmin() {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const [state, formAction] = useFormState(uploadOrUpdateStaticAd, {
    success: false,
  });

  const loadImage = async () => {
    const img = await getStaticAdImage();
    setCurrentImage(img);
  };

  useEffect(() => {
    loadImage();
  }, []);

  useEffect(() => {
    if (state.success) {
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
      loadImage();
    }
  }, [state.success]);

  return (
    <div className="w-full mx-auto p-6 bg-white border rounded-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Static Advertisement</h1>

      {currentImage && (
        <div className="border rounded-xl p-3">
          <p className="text-xs mb-2 text-gray-500">Current Image</p>
          <img src={currentImage} className="rounded-lg max-h-56 mx-auto" />
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <input
          ref={inputRef}
          type="file"
          name="image"
          accept="image/*"
          required
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) setPreview(URL.createObjectURL(file));
          }}
        />

        {preview && (
          <img src={preview} className="rounded-lg max-h-56 mx-auto" />
        )}

        <button
          className={`w-full py-2 rounded-xl text-white ${
            currentImage
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {currentImage ? "Update Image" : "Upload Image"}
        </button>
      </form>
    </div>
  );
}
