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
  const topImages = topImagesData || [];

  const middleImagesData = await getSliderImages(AD_SECTIONS.MIDDLE_HOME);
  const middleImages = (middleImagesData || [])
    .map((img) => img?.url)
    .filter(Boolean);
  const bottomImagesData = await getSliderImages(AD_SECTIONS.BOTTOM_HOME);
  const bottomImages = (bottomImagesData || [])
    .map((img) => img?.url)
    .filter(Boolean);

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
          </div>
          <HomeBottomAdBlock images={bottomImages} />
        </div>
      </section>
      <Footer />
    </div>
  );
}
