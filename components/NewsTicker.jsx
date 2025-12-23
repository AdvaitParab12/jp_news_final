"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NewsTicker() {
  const [news, setNews] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch("/api/breaking-news")
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setIndex(0);
      });
  }, []);

  useEffect(() => {
    if (!news.length) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % news.length);
    }, 5000);

    return () => clearInterval(id);
  }, [news.length]);

  useEffect(() => {
    if (index >= news.length) {
      setIndex(0);
    }
  }, [news.length]);

  if (!news.length) return null;

  const item = news[index];

  return (
    <div className="newsticker p-3">
      <h4>
        <span className="category">{item.category} : </span>
        {item.href ? (
          <Link href={item.href} target="_blank">{item.title}</Link>
        ) : (
          <span>{item.title}</span>
        )}
      </h4>
    </div>
  );
}
