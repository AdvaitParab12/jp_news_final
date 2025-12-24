"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function InterviewScroller() {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/interviews");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch interviews:", err);
      setItems([]);
    }
  };

  useEffect(() => {
    fetchItems();
    const interval = setInterval(fetchItems, 5000);

    const onUpdated = () => fetchItems();
    window.addEventListener("interviewsUpdated", onUpdated);

    return () => {
      clearInterval(interval);
      window.removeEventListener("interviewsUpdated", onUpdated);
    };
  }, []);

  return (
    <>
      <div className="block-title-1">
        <h3>Interviews</h3>
      </div>

      <div className="sidebar-newsfeed">
        <div className="newsfeed-3">
          <ul>
            {items.map((item) => (
              <li key={item._id}>
                <div className="item">
                  <div className="item-image">
                    <Link href={`/interviews/${item._id}`} className="img-link">
                      <Image
                        src={item.thumbnail}
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
                        href={`/interviews/${item._id}`}
                        className="line-clamp-2"
                      >
                        {item.title}
                      </Link>
                    </h4>
                  </div>
                </div>
              </li>
            ))}
            {items.length === 0 && <p className="px-7">No interviews yet.</p>}
          </ul>
        </div>
      </div>
    </>
  );
}
