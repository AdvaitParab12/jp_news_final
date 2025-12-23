"use client";

import { useEffect, useState } from "react";

export default function NavbarWrapper({ children }) {
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      setIsFixed(currentScroll > 100);

      if (currentScroll > lastScroll && currentScroll > 150) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted, lastScroll]);

  if (!mounted) return null;

  return (
    <div
        id="fixed-navbar"
      className={`navbar
        ${isFixed ? "affix" : "affix-top"}
        ${hidden ? "headroom-unpinned" : "headroom-pinned"}
      `}
    >
      {children}
    </div>
  );
}
