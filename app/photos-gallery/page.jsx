import QuickNav from "@/components/QuickNav";
import Navbar from "@/components/Navbar";
import PhotoGallry from "@/components/PhotoGallery";
import Footer from "@/components/Footer";

export default function PhotosGallery() {
  return (
    <div id="wrapper" data-color="red" className="overflow-hidden">
      <div id="header">
        <QuickNav />
        <Navbar />
      </div>
      <section id="main-section" className="mt-12">
        <div className="container mx-auto px-4">
          <div className="title-style01 mt-23">
            <h3 className="">
              {" "}
              <strong>Photo Gallery</strong>
            </h3>
          </div>
          <PhotoGallry />
        </div>
      </section>
      <section id="footer-section" className="mt-12">
        <Footer />
      </section>
    </div>
  );
}
