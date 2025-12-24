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
  const sliderItems = useMemo(() => {
    const items =
      images
        ?.map((img) => {
          if (typeof img === "string")
            return { url: img, title: "", hyperlink: "" };
          return {
            url: img?.url,
            title: img?.title || "",
            hyperlink: img?.hyperlink || "",
          };
        })
        .filter((item) => item.url) || [];

    // Debug: log images to console
    if (items.length > 0) {
      console.log("HomeTopAdBlock - Items:", items);
    }

    return items;
  }, [images]);

  // Reset index only when sliderItems array actually changes
  const itemsKey = useMemo(() => JSON.stringify(sliderItems), [sliderItems]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [itemsKey]);

  // Auto-rotation interval
  useEffect(() => {
    if (!sliderItems || sliderItems.length <= 1) return;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderItems.length);
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sliderItems]);

  if (!sliderItems || sliderItems.length === 0) {
    console.log("HomeTopAdBlock - No images to display");
    return null;
  }

  const prevImage = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentIndex((prev) => (prev === 0 ? sliderItems.length - 1 : prev - 1));

    // Restart auto-rotation after manual navigation
    if (sliderItems.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % sliderItems.length);
      }, 5000);
    }
  };

  const nextImage = () => {
    // Clear and restart the interval when user manually navigates
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentIndex((prev) => (prev === sliderItems.length - 1 ? 0 : prev + 1));

    // Restart auto-rotation after manual navigation
    if (sliderItems.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % sliderItems.length);
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
    if (sliderItems.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % sliderItems.length);
      }, 5000);
    }
  };

  const currentItem = sliderItems[currentIndex];

  return (
    <div className="relative w-full h-64 md:h-165 group">
      {/* Slider Image */}
      {currentItem ? (
        <div className="w-full h-full relative">
          {currentItem.hyperlink ? (
            <Link
              href={currentItem.hyperlink}
              target="_blank"
              className="block w-full h-full relative"
            >
              <div className="relative w-full h-full">
                <Image
                  src={currentItem.url}
                  alt={currentItem.title || `Slider ${currentIndex + 1}`}
                  fill
                  priority
                  className="object-cover shadow-md z-0"
                  onError={(e) => {
                    console.error("Image failed to load:", currentItem.url, e);
                    setImageError(true);
                  }}
                  onLoad={() => setImageError(false)}
                />
                {currentItem.title && (
                  <div className="absolute bottom-0 left-0 w-full z-20 bg-linear-to-t from-black/80 via-black/40 to-transparent p-6 pt-12">
                    <h2 className="text-white! text-center font-bold! bg-black/30 rounded-xl text-xl md:text-3xl drop-shadow-lg hover:underline">
                      {currentItem.title}
                    </h2>
                  </div>
                )}
              </div>
            </Link>
          ) : (
            <>
              <Image
                src={currentItem.url}
                alt={currentItem.title || `Slider ${currentIndex + 1}`}
                fill
                priority
                className="object-cover shadow-md -z-10"
                onError={(e) => {
                  console.error("Image failed to load:", currentItem.url, e);
                  setImageError(true);
                }}
                onLoad={() => setImageError(false)}
              />
              {currentItem.title && (
                <div className="absolute bottom-0 left-0 z-10 w-full bg-linear-to-t from-black/80 via-black/40 to-transparent p-6 pt-12">
                  <h2 className="text-white text-xl md:text-2xl font-bold drop-shadow-lg">
                    {currentItem.title}
                  </h2>
                </div>
              )}
            </>
          )}
        </div>
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
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          prevImage();
        }}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition z-10"
        aria-label="Previous"
      >
        ‹
      </button>

      {/* Right Arrow */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          nextImage();
        }}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition z-10"
        aria-label="Next"
      >
        ›
      </button>

      {/* Indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {sliderItems.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            } cursor-pointer`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToImage(index);
            }}
          ></span>
        ))}
      </div>
    </div>
  );
}
