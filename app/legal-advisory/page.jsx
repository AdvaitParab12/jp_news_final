import Link from "next/link";
import Footer from "@/components/Footer";
import Clock from "@/components/Clock";
import Navbar from "@/components/Navbar";
import QuickNav from "@/components/QuickNav";
import BottomHomeAdBlock from "@/components/HomeBottomAdBlock";
import { AD_SECTIONS } from "@/lib/adSections";
import { getSliderImages } from "@/lib/getSliderImages";
export default async function AboutUs() {
  const bottomImagesData = await getSliderImages(AD_SECTIONS.BOTTOM_HOME);
    const bottomImages = (bottomImagesData || [])
      .map((img) => img?.url)
      .filter(Boolean);
  return (
    <div>
      <div id="wrapper" data-color="red">
        <header id="header">
          <QuickNav />
          <Navbar />
        </header>
        {/*========== END #HEADER ==========*/}
        {/*========== BEGIN #MAIN-SECTION ==========*/}
        <div id="main-section">
          {/*========== BEGIN .MODULE ==========*/}
          <section className="module-top mt50">
            <div className="container">
              <div className="row">
                {/* Begin .contact-us */}
                <div className="contact-us">
                  {/* Begin .contact-form */}
                  <div className="col-xs-12 col-sm-7 col-md-10 mb-70">
                    <div className="title-left title-style04 underline04">
                      <h3>About Us </h3>
                    </div>
                    <div className="content">
                      <p>
                        <strong>Janta Prakash Digital News </strong> is an
                        emerging digital news platform committed to delivering
                        truthful, timely, and people-centered journalism. We
                        bring authentic, ground-level stories straight to the
                        public with integrity, clarity, and accountability.{" "}
                        <br /> <br />
                        Our strength lies in hyper-local coverage across
                        Mumbai’s extended region—{" "}
                        <strong>
                          Thane, Kalyan, Ulhasnagar, Ambernath, Badlapur,
                          Karjat,
                        </strong>{" "}
                        and nearby areas. From civic challenges and
                        infrastructure developments to community highlights and
                        local events, we cover every issue that impacts the
                        daily lives of citizens.
                        <br /> <br />
                        Inspired by our guiding tagline,{" "}
                        <strong>“Janta ki Awaaz, Sach ka Prakash,”</strong> we
                        aim to amplify the voices of the people and illuminate
                        the truth. Our team works on the ground, identifying
                        real concerns, capturing genuine narratives, and
                        encouraging transparency in both governance and society.
                        <br /> <br />
                        With Link focus on neutral, responsible, and fearless
                        reporting, <strong>
                          Janta Prakash Digital News{" "}
                        </strong>{" "}
                        strives to build Link trustworthy and impactful digital
                        news space. Whether it’s breaking updates, public
                        concerns, social campaigns, or human stories, we stand
                        firmly with the community.
                        <br /> <br />
                        <strong> Our Mission:</strong>
                        To strengthen communities by providing accurate and
                        timely local news.
                        <br />
                        <br />
                        <strong> Our Vision: </strong>
                        To become the most trusted digital news platform for
                        every community we reach.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <img src="img/Janta_prakash_.jpg" className="#" />
                  </div>
                  {/* End .contact-form */}
                </div>
                {/* End .contact-us */}
              </div>
          <BottomHomeAdBlock images={bottomImages}/>
            </div>
          </section>
          {/*========== END .MODULE ==========*/}
        </div>
        {/*========== END #MAIN-SECTION ==========*/}
        <Footer />
      </div>
      {/* End .parallax */}
    </div>
  );
}
