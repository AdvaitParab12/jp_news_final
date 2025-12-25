import Image from "next/image";
import Link from "next/link";
import QuickNav from "@/components/QuickNav";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeBottomAdBlock from "@/components/HomeBottomAdBlock";
import { AD_SECTIONS } from "@/lib/adSections";
import { getSliderImages } from "@/lib/getSliderImages";
import LocalNewsModel from "@/models/LocalNews";
import MumbaiNewsModel from "@/models/MumbaiNews";
import { connectDB } from "@/lib/mongodb";
import LocalNewsPaginatedList from "@/components/LocalNewsPaginatedList";

// Card UI moved to client component for pagination

export default async function LocalNews() {
  /* Ads */
  const bottomImagesData = await getSliderImages(AD_SECTIONS.BOTTOM_HOME);
  const bottomImages = (bottomImagesData || [])
    .map((img) => img?.url)
    .filter(Boolean);

  /* MongoDB - Fetch both collections */
  await connectDB();
  const localNewsData = await LocalNewsModel.find()
    .sort({ createdAt: -1 })
    .lean();
  const mumbaiNewsData = await MumbaiNewsModel.find()
    .sort({ createdAt: -1 })
    .lean();

  // Merge and deduplicate by title+excerpt
  const itemMap = new Map();

  localNewsData.forEach((item) => {
    const key = `${(item.title || "").trim()}||${(item.excerpt || "").trim()}`;
    if (!itemMap.has(key)) {
      itemMap.set(key, {
        ...item,
        sections: ["local"],
      });
    } else {
      const existing = itemMap.get(key);
      if (!existing.sections.includes("local")) {
        existing.sections.push("local");
      }
    }
  });

  mumbaiNewsData.forEach((item) => {
    const key = `${(item.title || "").trim()}||${(item.excerpt || "").trim()}`;
    if (!itemMap.has(key)) {
      itemMap.set(key, {
        ...item,
        sections: ["mumbai"],
      });
    } else {
      const existing = itemMap.get(key);
      if (!existing.sections.includes("mumbai")) {
        existing.sections.push("mumbai");
      }
    }
  });

  // Convert to array and sort by date
  const newsData = Array.from(itemMap.values()).sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div id="wrapper" data-color="red">
      <header id="header">
        <QuickNav />
        <Navbar />
      </header>

      <main id="main-section">
        <section className="module-top mt50">
          <div className="container">
            <div className="row no-gutter">
              <div className="contact-us">
                {/* News List */}
                <div className="col-xs-12 col-sm-7 col-md-9 mb-70">
                  <div className="module-title">
                    <h3 className="subtitle">Local News</h3>
                  </div>

                  <LocalNewsPaginatedList items={newsData} />
                </div>

                {/* Sidebar */}
                <aside className="col-xs-12 col-sm-12 col-md-3">
                  <Image
                    src="/img/colgate-this-dazzling.jpg"
                    alt="Ad"
                    width={300}
                    height={600}
                    className="img-responsive"
                  />
                </aside>
              </div>
              <HomeBottomAdBlock />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
