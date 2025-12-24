import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";
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

export default async function InterviewsPage() {
  const bottomImagesData = await getSliderImages(AD_SECTIONS.BOTTOM_HOME);
  const bottomImages = (bottomImagesData || [])
    .map((img) => img?.url)
    .filter(Boolean);

  let item = null;

  try {
    await connectDB();
    const dbItem = await Interview.findOne().sort({ createdAt: -1 }).lean();

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
  } catch (err) {
    console.error("Error fetching latest interview:", err);
  }

  if (!item) {
    return <div className="p-8">No interviews available.</div>;
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

                  {/* <div className="col-sm-4 col-md-4">
                    <div className="video-post_content">
                      <div className="title-left title-style04 underline04 underline04">
                        <h3>About Project</h3>
                      </div>

                      <div className="content line-clamp-6">
                        <p>{item.excerpt}</p>
                      </div>

                      <div className="md:relative md:top-40">
                        <div className="title-left title-style04 underline04">
                          <h3>Video Info</h3>
                        </div>

                        <ul>
                          <li>
                            <i className="fa fa-link" />{" "}
                            <span>Completed On:</span> {item.date}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div> */}
                  <div className="col-sm-4 col-md-4">
                    <div className="video-post_content grid grid-rows-[auto_1fr_auto] h-full">
                      {/* About Project */}
                      <div>
                        <div className="title-left title-style04 underline04">
                          <h3>About Project</h3>
                        </div>

                        <div className="content line-clamp-6">
                          <p>{item.excerpt}</p>
                        </div>
                      </div>

                      {/* Spacer */}
                      <div />

                      {/* Video Info (Sticky) */}
                      <div className="sticky top-24">
                        <div className="title-left title-style04 underline04">
                          <h3>Video Info</h3>
                        </div>

                        <ul>
                          <li>
                            <i className="fa fa-link" />{" "}
                            <span>Completed On:</span> {item.date}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>    

                  <div className="clear" />
                </div>
              </div>
            </div>
            {/* <NewsGallery />
            <HomeBottomAdBlock images={bottomImages} /> */}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
