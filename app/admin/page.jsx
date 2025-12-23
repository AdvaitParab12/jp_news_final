"use client";
import React, { useState } from "react";
import TopHomeImages from "@/components/admin/TopHomeAd";
import { ChevronRight, LayoutDashboard, Newspaper } from "lucide-react";
import MiddleHomeAd from "@/components/admin/MiddleHomeAd";
import BottomHomeAd from "@/components/admin/BottomHomeAd";
import BreakingNews from "@/components/admin/BreakingNews";
import StaticAd from "@/components/admin/StaticAd";
import LocalNews from "@/components/admin/LocalNews";
import MumbaiNews from "@/components/admin/MumbaiNewsScroller";
import LocalNewsScroller from "@/components/admin/LocalNewsScroller";
import InterviewScroller from "@/components/admin/InterviewScroller";
import NewsGallery from "@/components/admin/NewsGallery";

const AdminPage = () => {
  const [selectedSection, setSelectedSection] = useState(0);
  const sections = [
    {
      id: "topHomeAdvertisement",
      title: "Top Home Advertisement",
      icon: <LayoutDashboard />,
      content: (
        <TopHomeImages section="top-home-ad" title="Top Home Advertisement" />
      ),
    },
    {
      id: "middleHomeAdvertisement",
      title: "Middle Home Advertisement",
      icon: <Newspaper />,
      content: (
        <MiddleHomeAd
          section="middle-home-ad"
          title="Middle Home Advertisement"
        />
      ),
    },
    {
      id: "bottomHomeAdvertisement",
      title: "Bottom Home Advertisement",
      icon: <Newspaper />,
      content: (
        <BottomHomeAd
          section="bottom-home-ad"
          title="Bottom Home Advertisement"
        />
      ),
    },
    {
      id: "breakingNews",
      title: "Breaking News",
      icon: <Newspaper />,
      content: <BreakingNews />,
    },
    {
      id: "staticAd",
      title: "Static Advertisement",
      icon: <Newspaper />,
      content: <StaticAd />,
    },
    {
      id: "localNewsHome",
      title: "Local News Home Page",
      icon: <Newspaper />,
      content: <LocalNews />,
    },
    {
      id: "localNewsScroller",
      title: "Local Suburban News",
      icon: <Newspaper />,
      content: <LocalNewsScroller />,
    },
    {
      id: "mumbaiNewsScroller",
      title: "Mumbai Suburban Page",
      icon: <Newspaper />,
      content: <MumbaiNews />,
    },
    {
      id: "interviewScroller",
      title: "Interviews",
      icon: <Newspaper />,
      content: <InterviewScroller />,
    },
    {
      id: "newsGallery",
      title: "News Gallery",
      icon: <Newspaper />,
      content: <NewsGallery />,
    },
    // {
    //   id: "interviewsHome",
    //   title: "Interviews Home Page",
    //   icon: <Newspaper />,
    //   content: (
    //     <h2 className="text-lg font-bold">Manage Interviews Home List</h2>
    //   ),
    // },
    // {
    //   id: "localNewsPage",
    //   title: "Local News Page",
    //   icon: <Newspaper />,
    //   content: <h2 className="text-lg font-bold">About Us</h2>,
    // },
    // {
    //   id: "mumbaiNewsPage",
    //   title: "Mumbai News Page",
    //   icon: <Newspaper />,
    //   content: <h2 className="text-lg font-bold">About Us</h2>,
    // },
    // {
    //   id: "interviewsPage",
    //   title: "Interviews Page",
    //   icon: <Newspaper />,
    //   content: <h2 className="text-lg font-bold">Interview Page</h2>,
    // },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
        {/* LEFT SECTION: SIDEBAR */}
        <div className="col-span-1 space-y-3">
          <h3 className="text-slate-500 font-bold uppercase text-5xl md-block tracking-wider mb-4 px-2">
            Admin Panel
          </h3>
          {sections.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setSelectedSection(index)}
              className={`w-full text-left px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-between group ${
                selectedSection === index
                  ? "bg-blue-500 shadow-lg scale-105" // Active Style
                  : "bg-white text-slate-800 hover:bg-blue-50 border border-blue-100/30" // Inactive Style
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.title}</span>
              </div>
              <ChevronRight
                className={`w-5 h-5 transition-transform ${
                  selectedSection === index
                    ? "translate-x-1"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              />
            </button>
          ))}
        </div>

        {/* RIGHT SECTION: CONTENT AREA */}
        <div className="col-span-1 md:col-span-3">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-100 min-h-100">
            {sections[selectedSection].content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
