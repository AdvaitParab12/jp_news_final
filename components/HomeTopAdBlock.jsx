"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo, useRef } from "react";

export default function HomeTopAdBlock({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const [imageError, setImageError] = useState(false);

  // Normalize images - handle both array of strings and array of objects
  // Memoize to prevent unnecessary recalculations
  const imageUrls = useMemo(() => {
    const urls = images
      ?.map((img) => (typeof img === "string" ? img : img?.url))
      .filter(Boolean) || [];
    
    // Debug: log images to console
    if (urls.length > 0) {
      console.log("HomeTopAdBlock - Image URLs:", urls);
    }
    
    return urls;
  }, [images]);

  // Reset index only when imageUrls array actually changes
  const imageUrlsKey = useMemo(() => JSON.stringify(imageUrls), [imageUrls]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [imageUrlsKey]);

  // Auto-rotation interval
  useEffect(() => {
    if (!imageUrls || imageUrls.length <= 1) return;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [imageUrls]);

  if (!imageUrls || imageUrls.length === 0) {
    console.log("HomeTopAdBlock - No images to display");
    return null;
  }

  const prevImage = () => {
    // Clear and restart the interval when user manually navigates
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));

    // Restart auto-rotation after manual navigation
    if (imageUrls.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
      }, 5000);
    }
  };

  const nextImage = () => {
    // Clear and restart the interval when user manually navigates
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));

    // Restart auto-rotation after manual navigation
    if (imageUrls.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
      }, 5000);
    }
  };

  const goToImage = (index) => {
    // Clear and restart the interval when user clicks indicator
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentIndex(index);

    // Restart auto-rotation after manual navigation
    if (imageUrls.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
      }, 5000);
    }
  };

  return (
    <div className="relative w-full h-64 md:h-165">
      {/* Slider Image */}
      {imageUrls[currentIndex] ? (
        <Image
          src={imageUrls[currentIndex]}
          alt={`Slider ${currentIndex + 1}`}
          fill
          priority
          className="object-cover shadow-md"
          onError={(e) => {
            console.error("Image failed to load:", imageUrls[currentIndex], e);
            setImageError(true);
          }}
          onLoad={() => setImageError(false)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <p>No image available</p>
        </div>
      )}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
          <p>Failed to load image</p>
        </div>
      )}

      {/* Left Arrow */}
      <button
        onClick={prevImage}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
        aria-label="Previous"
      >
        ‹
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextImage}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
        aria-label="Next"
      >
        ›
      </button>

      {/* Indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
        {imageUrls.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            } cursor-pointer`}
            onClick={() => goToImage(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}
