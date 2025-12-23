"use client";

import { useEffect, useState, useRef } from "react";

export default function NewsGallery() {
  const [items, setItems] = useState(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await fetch("/api/news-gallery");
        const data = await res.json();
        if (active) {
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load news gallery:", err);
        if (active) setItems([]);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // DO NOT render until data is ready
  if (items === null) return null;

  return (
    <div>
      <div id="wrapper" data-color="red">
        <div id="main-section">
          <section className="module">
            <div className="container">
              <div className="row no-gutter">
                <div className="title-style01">
                  <h3>
                    <strong>News</strong> Gallery
                  </h3>
                </div>

                <div
                  id="big-gallery-slider-3"
                  ref={galleryRef}
                  className="gallery-carousel"
                >
                  {items.length === 0 ? (
                    <div className="big-gallery">
                      <img
                        src="img/news_slider-large-image01.jpg"
                        alt="placeholder"
                      />
                    </div>
                  ) : (
                    items.map((it) => (
                      <div className="big-gallery" key={it._id}>
                        <img
                          src={
                            it.image?.url ||
                            "img/news_slider-large-image01.jpg"
                          }
                          alt={it.title || "gallery"}
                        />
                        {it.videoUrl && (
                          <a
                            href={it.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span className="play-icon" />
                          </a>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="mt" style={{ margin: "10px 0px" }}>
                  <img
                    src="img/Horizontal_2.gif"
                    className="img-responsive"
                    alt="ad"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
