"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  const isActive = (path) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll) setHidden(true); // scrolling down
      else setHidden(false); // scrolling up
      setLastScroll(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);
  return (
    <div>
      <div className="container">
        <div className="header-logo">
          <Link href="/">
            <img src="/img/Top_logo_Janta_Prakash.png" alt="Site Logo" />
          </Link>
        </div>

        <div className="header-add-place">
          <div className="desktop-add">
            <Link href="#" target="_blank">
              <img src="/img/banner_728x90.jpg" alt="true" />
            </Link>
          </div>
        </div>

        <nav className="navbar navbar-default" id="mobile-nav">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle"
              data-toggle="collapse"
              id="sidenav-toggle"
            >
              {" "}
              <span className="icon-bar" /> <span className="icon-bar" />{" "}
              <span className="icon-bar" />{" "}
            </button>
            <div className="sidenav-header-logo">
              <Link href="/">
                {/* <h2>Janta Prakash <span>News</span></h2> */}
                <img src="/img/Top_logo_Janta_Prakash.png" alt="Site Logo" />
              </Link>
            </div>
          </div>
          <div
            className="sidenav"
            data-sidenav
            data-sidenav-toggle="#sidenav-toggle"
          >
            <button
              type="button"
              className="navbar-toggle active"
              data-toggle="collapse"
            >
              {" "}
              <span className="icon-bar" /> <span className="icon-bar" />{" "}
              <span className="icon-bar" />{" "}
            </button>
            <div className="sidenav-brand">
              <div className="sidenav-header-logo">
                <Link href="/">
                  {" "}
                  <img src="/img/Top_logo_Janta_Prakash.png" alt="Site Logo" />
                  <h2>Janta Prakash</h2>
                </Link>
              </div>
            </div>
            <ul className="sidenav-menu">
              <li>
                <Link href="/" className={isActive("/") ? "active" : ""}>
                  HOME
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className={isActive("/about-us") ? "active" : ""}
                >
                  ABOUT US
                </Link>{" "}
              </li>
              <li>
                <Link
                  href="/local-news"
                  className={isActive("/local-news") ? "active" : ""}
                >
                  LOCAL NEWS
                </Link>
              </li>
              <li>
                <Link
                  href="/mumbai-news"
                  className={isActive("/local-news") ? "active" : ""}
                >
                  MUMBAI NEWS
                </Link>
              </li>
              <li>
                <Link
                  href="/interviews"
                  className={isActive("/interviews") ? "active" : ""}
                >
                  INTERVIEWS
                </Link>
              </li>
              <li>
                <Link
                  href="/photos-gallery"
                  className={isActive("/photos-gallery") ? "active" : ""}
                >
                  PHOTOGALLERY
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className={isActive("/contact-us") ? "active" : ""}
                >
                  CONTACT US
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      {/* Desktop Navbar */}
      <div className="navbar sticky!" id="fixed-navbar">
        <div className="main-menu nav navbar-collapse" id="fixed-navbar-toggle">
          <div className="container">
            <ul className="nav navbar-nav">
              <li
                className={
                  isActive("/") ? "active hover-underline" : "hover-underline"
                }
              >
                <Link href="/">HOME</Link>
              </li>
              <li
                className={
                  isActive("/about-us")
                    ? "active hover-underline"
                    : "hover-underline"
                }
              >
                <Link href="/about-us">ABOUT US</Link>{" "}
              </li>
              <li
                className={
                  isActive("/local-news")
                    ? "active hover-underline"
                    : "hover-underline"
                }
              >
                <Link href="/local-news">LOCAL NEWS</Link>
              </li>
              <li
                className={
                  isActive("/mumbai-news")
                    ? "active hover-underline"
                    : "hover-underline"
                }
              >
                <Link href="/mumbai-news">MUMBAI NEWS</Link>
              </li>
              <li
                className={
                  isActive("/interviews")
                    ? "active hover-underline"
                    : "hover-underline"
                }
              >
                <Link href="/interviews">INTERVIEWS</Link>
              </li>
              <li
                className={
                  isActive("/photos-gallery")
                    ? "active hover-underline"
                    : "hover-underline"
                }
              >
                <Link href="/photos-gallery">PHOTOGALLERY</Link>
              </li>
              <li
                className={
                  isActive("/contact-us")
                    ? "active hover-underline"
                    : "hover-underline"
                }
              >
                <Link href="/contact-us">CONTACT US</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
