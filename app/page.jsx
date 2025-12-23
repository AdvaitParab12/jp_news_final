// import Link from "next/link";
// import Image from "next/image";
import { getSliderImages } from "@/lib/getSliderImages";
import { AD_SECTIONS } from "@/lib/adSections";
import StaticAd from "@/components/StaticAd";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import QuickNav from "@/components/QuickNav";
import NewsTicker from "@/components/NewsTicker";
import HomeTopAdBlock from "@/components/HomeTopAdBlock";
import HomeMiddleAdBlock from "@/components/HomeMiddleAdBlock";
import HomeBottomAdBlock from "@/components/HomeBottomAdBlock";
import LocalNewsScroller from "@/components/LocalNewsScroller";
import MumbaiNewsScroller from "@/components/MumbaiNewsScroller";
import InterviewScroller from "@/components/InterviewScroller";

export default async function Page() {
  const topImagesData = await getSliderImages(AD_SECTIONS.TOP_HOME);
  const topImages = (topImagesData || [])
    .map((img) => img?.url)
    .filter(Boolean);
  const middleImagesData = await getSliderImages(AD_SECTIONS.MIDDLE_HOME);
  const middleImages = (middleImagesData || [])
    .map((img) => img?.url)
    .filter(Boolean);
  const bottomImagesData = await getSliderImages(AD_SECTIONS.BOTTOM_HOME);
  const bottomImages = (bottomImagesData || [])
    .map((img) => img?.url)
    .filter(Boolean);

  // Debug: log images to console (server-side)
  if (topImages.length > 0) {
    console.log("Page - Top images:", topImages);
  } else {
    console.log("Page - No top images found");
  }
  if (bottomImages.length > 0) {
    console.log("Page - Bottom images:", bottomImages);
  } else {
    console.log("Page - No bottom images found");
  }
  if (middleImages.length > 0) {
    console.log("Page - Bottom images:", middleImages);
  } else {
    console.log("Page - No bottom images found");
  }
  // const newsItems = [
  //   {
  //     id: 1,
  //     image: "/img/Udhav.jpg",
  //     title: "उद्धव ठाकरेंनी एकनाथ शिंदेचा बालेकिल्ला",
  //     excerpt: "शिवसेना उद्धव बाळासाहेब ठाकरे पक्षाने.",
  //     url: "#",
  //   },
  //   {
  //     id: 2,
  //     image: "/img/Shruti.jpg",
  //     title: "स्मृती आणि पलाशचं लग्न होणार की नाही?",
  //     excerpt: "यांच्या लग्नाबाबत रोज काही ना काही.",
  //     url: "#",
  //   },
  //   {
  //     id: 3,
  //     image: "/img/hardik.jpg",
  //     title: "अभिषेक शर्माकडून हार्दिक पांड्याची धुलाई, 18 चेंडूत…",
  //     excerpt: "सय्यद मुश्ताक अली ट्रॉफी 2025 स्पर्धेत.",
  //     url: "#",
  //   },
  //   // Add more items or repeat if necessary
  // ];

  return (
    <div id="wrapper" data-color="red" className="overflow-hidden">
      <div id="header">
        <QuickNav />
        <Navbar />
      </div>
      <section id="main-section">
        <section className="module">
          <div className="container">
            <div className="outer">
              <div className="breaking-ribbon">
                <h4>Breaking News</h4>
              </div>
              <NewsTicker />
            </div>
          </div>
        </section>
        <section className="module slider">
          <section className="container">
            <section className="row no-gutter">
              <div className="col-md-9">
                <HomeTopAdBlock images={topImages} />
              </div>

              <div className="col-md-3">
                <div className="mt">
                  <StaticAd />
                </div>
              </div>
            </section>
          </section>
        </section>
      </section>
      <section className="module">
        <div className="container">
          <HomeMiddleAdBlock images={middleImages} />
        </div>
      </section>
      <section className="module">
        <div className="container">
          <div className="row no-gutter">
            <div className="col-md-4">
              <LocalNewsScroller />
            </div>

            <div className="col-md-4">
              <MumbaiNewsScroller />
            </div>

            <div className="col-md-4">
              <InterviewScroller />
            </div>

            {/* <LocalNewsBlock />
            <MumbaiNewsBlock /> */}

            <div className="col-md-4">
              {/* <div className="sidebar-newsfeed">
                <div className="newsfeed-3">
                  <ul>
                    {newsItems.map((item, index) => (
                      <li key={index}>
                        <div className="item">
                          <div className="item-image">
                            <Link href={item.url} className="img-link">
                              <Image
                                src={item.image}
                                alt={item.title}
                                width={400} // Adjust based on your CSS
                                height={250} // Adjust based on your CSS
                                className="img-responsive img-full"
                                style={{ objectFit: "cover" }}
                              />
                            </Link>
                          </div>
                          <div className="item-content">
                            <h4 className="ellipsis">
                              <Link href={item.url}>{item.title}</Link>
                            </h4>
                            <p className="ellipsis">
                              <Link href={item.url}>{item.excerpt}</Link>
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div> */}
            </div>
          </div>
          <HomeBottomAdBlock images={bottomImages} />
        </div>
      </section>
      <Footer />
    </div>
  );
}
