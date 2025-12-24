import Image from "next/image";
import QuickNav from "@/components/QuickNav";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
async function getNewsById(id) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/news/${id}`, { cache: "no-store" });

  if (!res.ok) return null;
  return res.json();
}

export default async function NewsDetail({ params }) {
  const { id } = await params;
  const news = await getNewsById(id);

  if (!news) {
    return <p className="container mt-10">News not found.</p>;
  }

  return (
    <div id="wrapper" data-color="red">
      <QuickNav />
      <Navbar />
      <div id="main-section">
        <section className="module-top mt50">
          <div className="container">
            <div className="breadcrumb-line mb-10">
              <ul className="breadcrumb">
                <li>
                  <h5>Local News</h5>
                </li>
                <li className="active">{news.title}</li>
              </ul>
            </div>
          </div>

          <div className="container">
            <div className="row">
              {/* Main Content */}
              <div className="col-xs-12 col-sm-7 col-md-9 mb-70">
                <div className="post post-full clearfix">
                  <div className="entry-media">
                    <Image
                      src={news.image}
                      alt={news.title}
                      width={900}
                      height={500}
                      className="img-responsive"
                    />
                  </div>

                  <div className="entry-main">
                    <h4>{news.title}</h4>

                    <div className="post-meta-date news-date">
                      {new Date(news.createdAt).toDateString()}
                    </div>

                    <div className="entry-content">
                      <p>{news.content}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="col-xs-12 col-md-3"></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
