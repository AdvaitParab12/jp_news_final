import { getSliderImages } from "@/lib/getSliderImages";
import { AD_SECTIONS } from "@/lib/adSections";
import Clock from "@/components/Clock";
import QuickNav from "@/components/QuickNav";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import HomeBottomAdBlock from "@/components/HomeBottomAdBlock";

export default async function ContactUs() {
  const bottomImagesData = await getSliderImages(AD_SECTIONS.BOTTOM_HOME);
  const bottomImages = (bottomImagesData || [])
    .map((img) => img?.url)
    .filter(Boolean);
  return (
    <div>
      <div id="wrapper" data-color="red">
        {/*========== BEGIN #HEADER ==========*/}
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
                  <div className="col-xs-12 col-sm-7 col-md-10">
                    <div className="title-left title-style04 underline04">
                      <h3>Get in touch</h3>
                    </div>
                    <form
                      id="contact-form"
                      method="post"
                      action="include/contact.php"
                      noValidate={true}
                    >
                      <div className="messages" />
                      <div className="controls">
                        <div className="row no-gutter">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="form_name">First Name *</label>
                              <input
                                id="form_name"
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Please enter your firstname *"
                                required
                                data-error="Firstname is required."
                              />
                              <div className="help-block with-errors" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="form_lastname">Last Name *</label>
                              <input
                                id="form_lastname"
                                type="text"
                                name="surname"
                                className="form-control"
                                placeholder="Please enter your lastname *"
                                required
                                data-error="Lastname is required."
                              />
                              <div className="help-block with-errors" />
                            </div>
                          </div>
                        </div>
                        <div className="row no-gutter">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="form_email">Email *</label>
                              <input
                                id="form_email"
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Please enter your email *"
                                required
                                data-error="Valid email is required."
                              />
                              <div className="help-block with-errors" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="form_phone">Contact Number</label>
                              <input
                                id="form_phone"
                                type="tel"
                                name="phone"
                                className="form-control"
                                placeholder="Please enter your phone"
                              />
                              <div className="help-block with-errors" />
                            </div>
                          </div>
                        </div>
                        <div className="row no-gutter">
                          <div className="form-group">
                            <label htmlFor="form_message">Message *</label>
                            <textarea
                              id="form_message"
                              name="message"
                              className="form-control"
                              placeholder="Message for me *"
                              rows={4}
                              required
                              data-error="Please,leave us a message."
                              defaultValue={""}
                            />
                            <div className="help-block with-errors" />
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <input
                                type="submit"
                                className="btn btn-success "
                                defaultValue="Submit"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row no-gutter">
                          <div className="col-md-12">
                            <p className="text-muted">
                              <strong>*</strong> These fields are required.
                            </p>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  {/* End .contact-form */}
                  <div className="col-xs-12 col-sm-5 col-md-2 ">
                    <div className="form-group">
                      <div className="title-left title-style04 underline04">
                        <h3>IMP Details</h3>
                      </div>
                      <div className="img">
                        <img
                          src="img/support-24.gif"
                          className="img-responsive"
                        />
                      </div>
                      <ul>
                        <li>
                          <i className="fa fa-envelope-o" aria-hidden="true" />
                          <span>E-mail:</span>{" "}
                          <a href="mailto:info@jantaprakashnews.com">
                            info@jantaprakashnews.com
                          </a>
                        </li>
                        <li>
                          <i className="fa fa-globe" aria-hidden="true" />
                          <span>Website:</span>{" "}
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
                </div>
                {/* End .contact-us */}
              </div>
            </div>
          </section>
          {/*========== END .MODULE ==========*/}
          {/*========== Begin .ADD ==========*/}
          <section>
            <div className="container">
              <div className="ro- no-gutter">
                <div className="mt" style={{ margin: "10px 0px" }}>
                  <HomeBottomAdBlock images={bottomImages} />
                </div>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
}
