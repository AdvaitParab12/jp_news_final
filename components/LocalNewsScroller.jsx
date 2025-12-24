"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function LocalNewsBlock() {
  const [newsItems, setNewsItems] = useState([]);

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/local-news");
      const data = await res.json();
      setNewsItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setNewsItems([]);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 5000);

    // listen for admin updates
    const onNewsUpdated = () => fetchNews();
    window.addEventListener("newsUpdated", onNewsUpdated);

    return () => {
      clearInterval(interval);
      window.removeEventListener("newsUpdated", onNewsUpdated);
    };
  }, []);

  return (
    <>
      <div className="block-title-1">
        <h3>Local Suburban News</h3>
      </div>

      <div className="sidebar-newsfeed">
        <div className="newsfeed-3">
          <ul>
            {newsItems.map((item) => (
              <li key={item._id}>
                <div className="item">
                  <div className="item-image">
                    <Link
                      href={`/local-news-scroller/${item._id}`}
                      className="img-link"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={400}
                        height={250}
                        style={{ objectFit: "cover" }}
                      />
                    </Link>
                  </div>
                  <div className="item-content">
                    <h4 className="ellipsis">
                      <Link
                        href={`/local-news-scroller/${item._id}`}
                       className="line-clamp-2"
                      >
                        {item.title}
                      </Link>
                    </h4>

                    <p className="ellipsis line-clamp-2">
                      <Link
                        href={`/local-news-scroller/${item._id}`}
                        className="line-clamp-1"
                      >
                        {item.excerpt}
                      </Link>
                    </p>
                  </div>
                </div>
              </li>
            ))}
            {newsItems.length === 0 && <p className="px-7">No news yet.</p>}
          </ul>
        </div>
      </div>
    </>
  );
}
