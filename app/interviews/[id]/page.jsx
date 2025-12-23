import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";
import mongoose from "mongoose";
import QuickNav from "@/components/QuickNav";
import Navbar from "@/components/Navbar";
import HomeBottomAdBlock from "@/components/HomeBottomAdBlock";
import { AD_SECTIONS } from "@/lib/adSections";
import { getSliderImages } from "@/lib/getSliderImages";
import Footer from "@/components/Footer";
import NewsGallery from "@/components/NewsGallery";

function toEmbedUrl(url) {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      if (url.includes("/embed/")) return url;
    }
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace(/^\//, "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  } catch (e) {
    return url;
  }
}

export default async function InterviewPage({ params }) {
  const bottomImagesData = await getSliderImages(AD_SECTIONS.BOTTOM_HOME);
  const bottomImages = (bottomImagesData || [])
    .map((img) => img?.url)
    .filter(Boolean);
  const { id } = await params;

  // Try to fetch via internal API first (keeps data consistent with scroller)
  let item = null;
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/interviews/${id}`);
    if (res.ok) {
      item = await res.json();
    }
  } catch (err) {
    console.error("Error fetching interview from API fallback to DB:", err);
  }

  // Fallback to direct DB lookup if API didn't return an item
  if (!item) {
    await connectDB();

    let dbItem = null;

    // If id looks like an ObjectId, use findById
    if (mongoose.Types.ObjectId.isValid(id)) {
      dbItem = await Interview.findById(id).lean();
    }

    // If not found, try treating id as encoded videoUrl or partial url
    if (!dbItem) {
      try {
        const decoded = decodeURIComponent(id);
        dbItem = await Interview.findOne({ videoUrl: decoded }).lean();
      } catch (e) {
        // ignore
      }
    }

    if (!dbItem) {
      try {
        const escaped = id.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
        dbItem = await Interview.findOne({
          videoUrl: { $regex: escaped, $options: "i" },
        }).lean();
      } catch (e) {
        // ignore
      }
    }

    if (dbItem) {
      item = {
        ...dbItem,
        _id: dbItem._id.toString(),
        thumbnail:
          typeof dbItem.thumbnail === "object" && dbItem.thumbnail?.url
            ? dbItem.thumbnail.url
            : dbItem.thumbnail || "",
        createdAt: dbItem.createdAt
          ? new Date(dbItem.createdAt).toISOString()
          : null,
        updatedAt: dbItem.updatedAt
          ? new Date(dbItem.updatedAt).toISOString()
          : null,
      };
    }
  }

  if (!item) {
    return <div className="p-8">Interview not found.</div>;
  }

  const embed = toEmbedUrl(item.videoUrl);

  return (
    <div id="wrapper" data-color="red">
      <QuickNav />
      <Navbar />
      <div id="main-section">
        <section className="module">
          <div className="container">
            <div className="row no-gutter">
              <div className="content-wrap">
                <div className="container clearfix">
                  <div className="col-sm-8 col-md-8">
                    <div className="video-full">
                      <div className="video-container">
                        <iframe
                          src={embed}
                          title={item.title}
                          frameBorder={0}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                          style={{ width: "100%", height: "420px" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-4 col-md-4">
                    <div className="video-post_content">
                      <div className="title-left title-style04 underline04">
                        <h3>{item.title}</h3>
                      </div>

                      <div className="content">
                        <p>{item.excerpt}</p>
                      </div>

                      <div className="title-left title-style04 underline04">
                        <h3>Video Info</h3>
                      </div>

                      <ul>
                        {/* <li>
                          <i className="fa fa-calendar" />{" "}
                          <span>Created By:</span> {item.createdBy}
                        </li> */}
                        <li>
                          <i className="fa fa-link" />{" "}
                          <span>Completed On:</span> {item.date}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="clear" />
                </div>
              </div>
            </div>
            <NewsGallery />
          <HomeBottomAdBlock images={bottomImages} />
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
