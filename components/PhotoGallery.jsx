"use client";

import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";

const PER_PAGE = 12;

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const load = () => {
      fetch("/api/photos", { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => setPhotos(Array.isArray(data) ? data : []));
    };

    load();

    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);
  useEffect(() => {
    setPage(1);
  }, [photos.length]);
  const start = (page - 1) * PER_PAGE;
  const pagePhotos = photos.slice(start, start + PER_PAGE);
  const emptySlots = PER_PAGE - pagePhotos.length;

  return (
    <section className="mt-12">
      <div className="container mx-auto px-4 mb-10">
        {/* <h3 className="text-2xl font-bold mb-6">Photo Gallery</h3> */}

        {/* GRID */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pagePhotos.map((img, i) => (
            <li key={img._id}>
              <div
                className="relative group cursor-pointer overflow-hidden rounded-lg"
                onClick={() => {
                  setIndex(i);
                  setOpen(true);
                }}
              >
                {/* Hover overlay */}
                <span className="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>

                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </li>
          ))}

          {/* empty slots to maintain grid */}
            {[...Array(emptySlots)].map((_, i) => (
              <li
                key={i}
                className="bg-gray-100 h-48 rounded-lg animate-pulse"
              ></li>
            ))}
        </ul>

        {/* PAGINATION CONTROLS */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            className="px-4 py-2 bg-orange-400 rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Prev
          </button>

          <div className="text-md text-gray-700">
            Page {page} of {Math.max(1, Math.ceil(photos.length / PER_PAGE))}
          </div>

          <button
            className="px-4 py-2 bg-orange-400 rounded disabled:opacity-50"
            onClick={() =>
              setPage((p) =>
                Math.min(Math.ceil(photos.length / PER_PAGE), p + 1)
              )
            }
            disabled={page >= Math.ceil(photos.length / PER_PAGE)}
          >
            Next
          </button>
        </div>

        {/* LIGHTBOX */}
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={pagePhotos.map((p, i) => ({
            src: p.url,
            title: p.title || "Image",
            description: `Image ${i + 1} of ${pagePhotos.length}`,
          }))}
          styles={{
            container: { backgroundColor: "rgba(0,0,0,0.85)" },
            slide: {
              maxWidth: "85%",
              maxHeight: "85%",
              margin: "auto",
              animation: "zoomIn 0.35s ease",
            },
          }}
        />
      </div>
    </section>
  );
}
