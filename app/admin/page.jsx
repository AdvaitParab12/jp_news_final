"use client";
import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

import TopHomeImages from "@/components/admin/TopHomeAd";
import MiddleHomeAd from "@/components/admin/MiddleHomeAd";
import BottomHomeAd from "@/components/admin/BottomHomeAd";
import BreakingNews from "@/components/admin/BreakingNews";
import StaticAd from "@/components/admin/StaticAd";
import LocalNews from "@/components/admin/LocalNews";
import MumbaiNews from "@/components/admin/MumbaiNewsScroller";
import LocalNewsScroller from "@/components/admin/LocalNewsScroller";
import InterviewScroller from "@/components/admin/InterviewScroller";
import NewsGallery from "@/components/admin/NewsGallery";
import PhotoGallery from "@/components/admin/PhotoGallery";

const AdminPage = () => {
  const [selectedSection, setSelectedSection] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin:selectedSection") || "topHomeAd";
    }
    return "topHomeAd";
  });
  
  const [adMenuOpen, setAdMenuOpen] = useState(false);
  useEffect(() => {
    localStorage.setItem("admin:selectedSection", selectedSection);
  }, [selectedSection]);

  useEffect(() => {
    localStorage.setItem("admin:adMenuOpen", adMenuOpen);
  }, [adMenuOpen]);

  const sections = {
    topHomeAd: (
      <TopHomeImages section="top-home-ad" title="Top Home Advertisement" />
    ),
    middleHomeAd: (
      <MiddleHomeAd
        section="middle-home-ad"
        title="Middle Home Advertisement"
      />
    ),
    bottomHomeAd: (
      <BottomHomeAd
        section="bottom-home-ad"
        title="Bottom Home Advertisement"
      />
    ),
    breakingNews: <BreakingNews />,
    staticAd: <StaticAd />,
    localNewsHome: <LocalNews />,
    localNewsScroller: <LocalNewsScroller />,
    mumbaiNewsScroller: <MumbaiNews />,
    interviewScroller: <InterviewScroller />,
    newsGallery: <NewsGallery />,
    photoGallery: <PhotoGallery />,
  };

  const menuButton = (id, label) => (
    <button
      onClick={() => setSelectedSection(id)}
      className={`w-full text-left px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-between ${
        selectedSection === id
          ? "bg-orange-400 text-white! shadow"
          : "bg-white hover:bg-blue-50 border border-blue-100/40"
      }`}
    >
      <span>{label}</span>
      <ChevronRight className="w-4 h-4" />
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
        {/* SIDEBAR */}
        <aside className="space-y-4">
          <h3 className="text-slate-500 font-bold uppercase text-4xl tracking-wider px-2">
            Admin Panel
          </h3>

          {/* Advertisement Dropdown */}
          <div className="">
            <button
              onClick={() => setAdMenuOpen(!adMenuOpen)}
              className="w-full px-6 py-4 bg-slate-100 rounded-xl font-bold flex items-center justify-between"
            >
              <div className="flex items-center gap-3">Advertisement</div>
              {adMenuOpen ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>

            {adMenuOpen && (
              <div className="ml-4 space-y-2">
                {menuButton("topHomeAd", "Top Advertisement")}
                {menuButton("middleHomeAd", "Middle Advertisement")}
                {menuButton("bottomHomeAd", "Bottom Advertisement")}
                {menuButton("staticAd", "Single Advertisement")}
              </div>
            )}
          </div>

          {/* Other Sections */}

          {menuButton("breakingNews", "Breaking News")}
          {/* {menuButton("localNewsHome", "News Section")} */}
          {menuButton("localNewsScroller", "News Section")}
          {/* {menuButton("mumbaiNewsScroller", "Mumbai Suburban Page")} */}
          {menuButton("interviewScroller", "Interviews")}
          {menuButton("newsGallery", "News Gallery")}
          {menuButton("photoGallery", "Photo Gallery")}
        </aside>

        {/* CONTENT AREA */}
        <main className="md:col-span-3">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-100 min-h-100">
            {sections[selectedSection]}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
