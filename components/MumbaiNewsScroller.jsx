"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function MumbaiNewsBlock() {
  const [newsItems, setNewsItems] = useState([]);

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/mumbai-news");
      const data = await res.json();
      setNewsItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch Mumbai news:", err);
      setNewsItems([]);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 5000);
    const onNewsUpdated = () => fetchNews();
    window.addEventListener("mumbaiNewsUpdated", onNewsUpdated);
    return () => {
      clearInterval(interval);
      window.removeEventListener("mumbaiNewsUpdated", onNewsUpdated);
    };
  }, []);

  return (
    <>
      <div className="block-title-1">
        <h3>Mumbai News</h3>
      </div>

      <div className="sidebar-newsfeed">
        <div className="newsfeed-3">
          <ul>
            {newsItems.map((item) => (
              <li key={item._id}>
                <div className="item">
                  <div className="item-image">
                    <Link href={`/local-news/${item._id}`} className="img-link">
                      <Image
                        src={item.image || "/img/placeholder.png"}
                        alt={item.title}
                        width={400}
                        height={250}
                        style={{ objectFit: "cover" }}
                      />
                    </Link>
                  </div>
                  <div className="item-content">
                    <h4 className="ellipsis">
                      <Link  className="line-clamp-2" href={`/local-news/${item._id}`}>{item.title}</Link>
                    </h4>
                    {/* <div className="text-xs text-gray-500 mb-1">
                      {item.category}
                    </div> */}
                    <p
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "18rem",
                      }}
                    >
                      <Link href={`/local-news/${item._id}`}>
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
