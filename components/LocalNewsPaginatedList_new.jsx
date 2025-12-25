"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

const PAGE_SIZE = 6;

export default function LocalNewsPaginatedList({ items }) {
  const [page, setPage] = useState(1);

  const total = Array.isArray(items) ? items.length : 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const current = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return (items || []).slice(start, start + PAGE_SIZE);
  }, [items, page]);

  const goTo = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="article">
        {current.map((item) => {
          const formattedDate =
            item.date || item.createdAt
              ? new Date(item.date || item.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }
                )
              : "";

          return (
            <div
              className="entry-block-small h-fit!"
              key={`${item._id}-${formattedDate}`}
            >
              <div className="entry-image">
                <Link href="/news-details" className="img-link">
                  <Image
                    src={item.image?.url || item.image}
                    alt={item.title}
                    width={800}
                    height={500}
                    className="img-responsive img-full"
                  />
                </Link>
              </div>

              <div className="entry-content" style={{ padding: "15px" }}>
                <p
                  style={{
                    margin: "0 0 10px 0",
                    color: "#ff9800",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {formattedDate}
                </p>
                <h4 style={{ margin: "0 0 8px 0" }}>
                  <Link
                    href="/news-details"
                    className="external-link line-clamp-2"
                    style={{ fontSize: "16px", fontWeight: "600" }}
                  >
                    {item.title}
                  </Link>
                </h4>
                <p
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "13px",
                    color: "#666",
                    lineHeight: "1.4",
                  }}
                >
                  <Link
                    href="/news-details"
                    className="external-link line-clamp-2"
                  >
                    {item.excerpt}
                  </Link>
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {(item.sections?.includes("local") || !item.sections) && (
                    <span
                      style={{
                        display: "inline-block",
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                        padding: "4px 12px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      LOCAL NEWS
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            onClick={() => goTo(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>

          {/* page numbers (at most 7) */}
          {Array.from({ length: totalPages })
            .slice(0, 7)
            .map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  className={`px-3 py-2 rounded ${
                    p === page
                      ? "bg-orange-400 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => goTo(p)}
                >
                  {p}
                </button>
              );
            })}

          <button
            className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            onClick={() => goTo(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

