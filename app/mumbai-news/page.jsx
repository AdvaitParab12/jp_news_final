import Image from "next/image";
import Link from "next/link";
import QuickNav from "@/components/QuickNav";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeBottomAdBlock from "@/components/HomeBottomAdBlock";
import { AD_SECTIONS } from "@/lib/adSections";
import { getSliderImages } from "@/lib/getSliderImages";
import News from "@/models/LocalNews";
import { connectDB } from "@/lib/mongodb";

/* Reusable News Card */
const NewsCard = ({ date, title, excerpt, category, imageUrl }) => (
  <div className="entry-block-small">
    <div className="entry-image">
      <Link href="/news-details" className="img-link">
        <Image
          src={imageUrl}
          alt={title}
          width={800}
          height={500}
          className="img-responsive img-full"
        />
      </Link>
    </div>

    <div className="entry-content">
      <h4>
        <span className="day news-date">{date}</span>
      </h4>
      <p>
        <Link href="/news-details" className="external-link">
          {title}
        </Link>
      </p>
      <p style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        <Link href="/news-details" className="external-link">
          {excerpt}
        </Link>
      </p>
      <div>
        <span className="read-more">{category}</span>
      </div>
    </div>
  </div>
);

export default async function LocalNews() {
  /* Ads */
  const bottomImagesData = await getSliderImages(AD_SECTIONS.BOTTOM_HOME);
  const bottomImages = (bottomImagesData || [])
    .map((img) => img?.url)
    .filter(Boolean);

  /* MongoDB */
  await connectDB();
  const newsData = await News.find().sort({ createdAt: -1 }).lean(); // CRITICAL

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
                    <h3 className="subtitle">Mumbai News</h3>
                  </div>

                  <div className="article">
                    {newsData.map((item) => (
                      <NewsCard
                        key={item._id}
                        date={item.date}
                        title={item.title}
                        // excerpt={item.excerpt}
                        category={item.category}
                        imageUrl={item.image?.url}
                      />
                    ))}
                  </div>

                  {/* Pagination (static for now) */}
                  {/* <ul className="pagination">
                    <li>
                      <Link href="#">‹</Link>
                    </li>
                    <li className="active">
                      <Link href="#">1</Link>
                    </li>
                    <li>
                      <Link href="#">2</Link>
                    </li>
                    <li>
                      <Link href="#">›</Link>
                    </li>
                  </ul> */}
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
