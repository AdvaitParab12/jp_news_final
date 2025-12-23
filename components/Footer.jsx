import Link from "next/link";
import Counter from "@/components/Counter";

export default function Footer() {
  return (
    <footer id="footer">
      {/* Begin .parallax */}
      <div id="parallax-section2">
        <div className="bg parallax2 overlay img-overlay2">
          <div className="container">
            <div className="row no-gutter footer-info">
              <div className="col-sm-6 col-md-2">
                <div className="site-logo text-center ">
                  <a href="index.html">
                    <img src="/img/Logo_Footer.jpg" alt="Side Logo" />
                  </a>
                </div>
              </div>
              <div className="col-sm-6 col-md-4">
                <h3 className="title-left title-style03 underline03">
                  IMP Tags
                </h3>
                <div className="tagcloud">
                  <Link href="/">Home</Link>
                  <Link href="/about-us">About News</Link>
                  <Link href="/interviews">Interviews</Link>
                  <Link href="/contact-us">Contact Us</Link>
                  <Link href="/photo-gallery">Gallery</Link>
                  <Link href="/local-news">Ambernath News</Link>
                  <Link href="#">Mumbai News</Link>
                  <Link href="/legal-advisory">Legal Advisory</Link>
                  <Link href="/">Corporate</Link>{" "}
                  <Link href="https://bollywoodhi.com" target="_blank">
                    Entertainment
                  </Link>
                  <a href="https://jantaprakashnews.com">Primetime News</a>{" "}
                </div>
              </div>
              <div className="col-xs-12 col-sm-5 col-md-3  ">
                <div className="form-group">
                  <h3 className="title-left title-style03 underline03">
                    Support
                  </h3>
                  <ul>
                    <li>
                      <i className="fa fa-envelope-o" aria-hidden="true" />
                      <span style={{ color: "#fff" }}>E-mail:</span>{" "}
                      <a href="mailto:info@jantaprakashnews.com">
                        info@jantaprakashnews.com
                      </a>
                    </li>
                    <li>
                      <i className="fa fa-globe" aria-hidden="true" />
                      <span style={{ color: "#fff" }}>Website:</span>{" "}
                      <a
                        href="https://www.jantaprakashnews.com"
                        target="_blank"
                      >
                        www.jantaprakashnews.com
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-sm-6 col-md-3 footer">
                <h3 className="title-left title-style03 underline03">
                  Social Connect
                </h3>
                <div className="Social">
                  <ul>
                    <li>
                      {" "}
                      <a href="#" className="facebook">
                        <img src="/img/fb.png" title="Facebook" />{" "}
                      </a>{" "}
                    </li>
                    <li>
                      {" "}
                      <a
                        href="https://youtube.com/@jantaprakashnews?si=SehEQhWY8qWKO8ff"
                        target="_blank"
                        className="linkedin"
                      >
                        <img src="/img/youtube.png" title="youtube" />
                      </a>{" "}
                    </li>
                    <li>
                      {" "}
                      <a
                        href="https://www.instagram.com/jantaprakashnews/?igsh=dThwMjFtb3JldG51"
                        target="_blank"
                        className="google-plus"
                      >
                        <img src="/img/Insta_Social.png" title="Instagram" />
                      </a>{" "}
                    </li>
                    <li>
                      {" "}
                      <a
                        href="https://x.com/Janta_Prakash/status/1997920162864038044?s=08"
                        target="_blank"
                        className="twitter"
                      >
                        <img src="/img/X.png" title="X" />
                      </a>{" "}
                    </li>
                  </ul>
                </div>
                <Counter />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="copyrights">
        {/* Begin .container */}
        <div className="container">
          {/* Begin .copyright */}
          <div className="copyright">
            {" "}
            © 2025, Copyrights Janta Prakash News. All Rights Reserved{" "}
          </div>
          {/* End .copyright */}
        </div>
        {/* End .container */}
      </div>
    </footer>
  );
}
