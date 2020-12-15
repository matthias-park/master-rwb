import React from 'react';
import { Link } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';

const CopyWrite = () => (
  <div className="footer-copyright d-flex align-items-center order-4 order-lg-1 flex-grow-1 flex-lg-grow-0 my-1">
    <img
      alt="18_mini"
      className="mx-1"
      data-html="true"
      data-placement="top"
      data-toggle="tooltip"
      height="24"
      src="/bnl/images/theme15/images/footer/18_mini.png"
      title=""
      width="24"
      data-original-title="You must be over 18 years of age to register and place bets.<br>TonyBet reserves the right to ask any customer to prove their age.<br>Customer accounts may be suspended until a satisfactory proof is provided."
    />
    <p>
      © TonyBet.All Rights Reserved.
      <br className="copyright-br" />
      Underage gambling is forbidden
    </p>
  </div>
);

const FooterHeaderButtons = () => {
  // const { pathname } = useLocation();
  // const [showLocaleMenu, setShowLocaleMenu] = useState(false);
  return (
    <div className="footer-button-wrapper d-flex flex-wrap order-2 flex-grow-1">
      <div className="mobile-apps d-flex order-1 order-lg-2 my-1 ml-lg-auto">
        <a
          href="http://android.tonybet.com/TonyBet.apk"
          className="btn btn-opacity mx-1 d-flex align-items-center"
        >
          <img
            alt="Android"
            src="../assets/images/theme15/images/footer/phone-android.png"
          />
          <p>
            Download the app
            <br />
            <span>For Android</span>
          </p>
        </a>
      </div>

      <div className="footer-settings d-flex order-2 order-lg-3 my-1 flex-grow-1">
        <div className="dropdown kofs order-2 order-md-1">
          <button
            className="btn btn-opacity dropdown-toggle"
            type="button"
            id="oddsMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            1.50
          </button>
          <div
            className="dropdown-menu"
            aria-labelledby="oddsMenuButton"
            x-placement="top-start"
          >
            <form
              id="form_setFormat"
              name="form_setFormat"
              action=""
              method="get"
            >
              <ul>
                <li className="radio custom-control custom-radio">
                  <input
                    className="custom-control-input"
                    id="format_eu"
                    type="radio"
                    name="setFormat"
                    value="/event_odd_formats/eu/update"
                  />
                  <label className="custom-control-label" htmlFor="format_eu">
                    Decimal (1.50)
                  </label>
                </li>
                <li className="radio custom-control custom-radio">
                  <input
                    className="custom-control-input"
                    id="format_us"
                    type="radio"
                    name="setFormat"
                    value="/event_odd_formats/us/update"
                  />
                  <label className="custom-control-label" htmlFor="format_us">
                    American (-200)
                  </label>
                </li>
                <li className="radio custom-control custom-radio">
                  <input
                    className="custom-control-input"
                    id="format_uk"
                    type="radio"
                    name="setFormat"
                    value="/event_odd_formats/uk/update"
                  />
                  <label className="custom-control-label" htmlFor="format_uk">
                    Fractional (1/2)
                  </label>
                </li>
              </ul>
            </form>
          </div>
        </div>
        <div className="dropdown timezones order-1 order-md-2 flex-grow-1">
          <button
            id="timezones"
            className="btn btn-opacity dropdown-toggle"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            08:09 GMT+0300
          </button>
          <div className="dropdown-menu" x-placement="top-start">
            <form
              id="form_setTime"
              name="form_setTime"
              action="/set-timezone"
              method="post"
            >
              <p>Nearest country</p>
              <p>All countries</p>
              <ul className="os-host os-theme-dark os-host-resize-disabled os-host-scrollbar-horizontal-hidden os-host-scrollbar-vertical-hidden os-host-transition">
                <div className="os-resize-observer-host">
                  <div
                    className="os-resize-observer observed"
                    style={{ left: '0px', right: 'auto' }}
                  ></div>
                </div>
                <div
                  className="os-size-auto-observer"
                  style={{ height: 'calc(100% + 1px)', float: 'left' }}
                >
                  <div className="os-resize-observer observed"></div>
                </div>
                <div
                  className="os-content-glue"
                  style={{ width: '100%', margin: '0px' }}
                ></div>
                <div className="os-padding">
                  <div className="os-viewport os-viewport-native-scrollbars-invisible">
                    <div
                      className="os-content"
                      style={{ padding: '0px', height: '100%', width: '100%' }}
                    >
                      <li className="radio custom-control custom-radio">
                        <div className="radio">
                          <input
                            className="custom-control-input"
                            id="tz_Europe/Vilnius"
                            type="radio"
                            name="timezone"
                            value="Europe/Vilnius"
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="tz_Europe/Vilnius"
                          >
                            Europe/Vilnius
                          </label>
                        </div>
                        <div
                          id="allTimeZones"
                          className="countries loader-light nano has-scrollbar"
                        >
                          Loading...
                        </div>
                      </li>
                    </div>
                  </div>
                </div>
                <div className="os-scrollbar os-scrollbar-horizontal os-scrollbar-unusable os-scrollbar-auto-hidden">
                  <div className="os-scrollbar-track os-scrollbar-track-off">
                    <div
                      className="os-scrollbar-handle"
                      style={{ transform: 'translate(0px, 0px)' }}
                    ></div>
                  </div>
                </div>
                <div className="os-scrollbar os-scrollbar-vertical os-scrollbar-unusable os-scrollbar-auto-hidden">
                  <div className="os-scrollbar-track os-scrollbar-track-off">
                    <div
                      className="os-scrollbar-handle"
                      style={{ transform: 'translate(0px, 0px)' }}
                    ></div>
                  </div>
                </div>
                <div className="os-scrollbar-corner"></div>
              </ul>
            </form>
          </div>
        </div>
        {/* <div className="dropdown language order-3">
          <button
            className="btn btn-opacity dropdown-toggle"
            onClick={() => setShowLocaleMenu(!showLocaleMenu)}
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {locale}
          </button>
          <div
            className={`dropdown-menu ${showLocaleMenu ? 'show' : ''}`}
            aria-labelledby="dropdownMenuButton"
            x-placement="top-start"
          >
            {locales?.map(lang => (
              <Link className="lang-ee dropdown-item" key={lang} to={pathname}>
                {lang}
              </Link>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

const FooterHeader = () => {
  return (
    <div className="footer-header">
      <div className="d-flex flex-wrap justify-content-between">
        <CopyWrite />
        <FooterHeaderButtons />
      </div>
    </div>
  );
};

const FooterMenu = () => (
  <div className="footer-menu">
    <div className="d-flex flex-column">
      <div className="footer-disclaimer d-flex flex-wrap my-1 text-read-more collapsed">
        <p>
          <span></span>
        </p>
        <p>
          Gambling is not a proper way to solve your financial problems. Please
          read the terms and act responsibly. 18+ only, T&amp;Cs apply.
        </p>
        <p>
          TonyBet OÜ, an Operator incorporated in Estonia, registration code
          12103082, having its registered office at Punane tn 14a-4. korrus
          419/4, 13619 Tallinn, Estonia.
        </p>
        <a href="/" id="seo_footer_link">
          TonyBet
        </a>
        <div id="seo_footer_ext" style={{ display: 'none' }}>
          TonyBet
        </div>
        <a href="/" className="read-more">
          <span className="show">Read More</span>
          <span className="">Read less</span>
        </a>

        <p></p>
      </div>
      <div className="row d-flex justify-content-start justify-content-md-between">
        <div className="col-4 col-md-3">
          <h4>Products</h4>
          <div className="row footer-menu-products">
            <div className="col-12 col-md-6">
              <ul>
                <li>
                  <a href="/sport">Sports</a>
                </li>
                <li>
                  <a href="/in-play">In-Play</a>
                </li>
                <li>
                  <a href="/casino">Casino</a>
                </li>
              </ul>
            </div>
            <div className="col-12 col-md-6">
              <ul>
                <li>
                  <a href="/betgamestv">Live Games</a>
                </li>
                <li>
                  <a href="/betonpoker">Bet on Poker</a>
                </li>
                <li>
                  <a href="/live-casino">Live Casino</a>
                </li>
                <li>
                  <a href="/articles/promotions" className="">
                    Promotions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-4 col-md-2  d-flex flex-column align-items-center">
          <div>
            <h4>Policies</h4>
            <ul>
              <li>
                <a data-gtm-item="null" href="/security">
                  Security &amp; Privacy
                </a>
              </li>
              <li>
                <a data-gtm-item="null" href="/betting-regulation">
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a data-gtm-item="null" href="/betting-rules">
                  Betting rules
                </a>
              </li>
              <li>
                <a data-gtm-item="null" href="/responsible_gambling">
                  Responsible Gambling
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-4 col-md-2 d-flex flex-column align-items-center footer-menu-company">
          <div>
            <h4>Company</h4>
            <ul>
              <li>
                <a data-gtm-item="null" href="/about_us">
                  About Us
                </a>
              </li>
              <li>
                <a href="http://blog.tonybet.com">Blog</a>
              </li>

              <li>
                <a href="/articles/news" className="">
                  News
                </a>
              </li>
              <li>
                <a href="https://affiliatestonybet.com/">Affiliates</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-4 col-md-2 d-flex flex-column align-items-md-center">
          <div>
            <h4>Help</h4>
            <ul>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <a href="/payments/payment_methods">Payment Methods</a>
              </li>
              <li>
                <a href="/contacts">Contact Us</a>
              </li>
              <li>
                <a href="http://tonybet.enetscores.com/statistics">
                  Statistics
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-4 col-md-2 d-flex flex-column align-items-center align-items-md-end">
          <div>
            <h4>Contact us</h4>
            <ul>
              <li>24/7 Customer Support</li>
              <li>
                <a href="mailto:info@tonybet.com">info@tonybet.com</a>
              </li>
              <li>
                <div className="social-media d-flex align-items-center">
                  <a href="https://www.facebook.com/Bet.At.TonyBet/">
                    <img
                      alt=""
                      src="/bnl/tonybet18/images/FB-7fcb1590ac1ec7a8be784ec6f973028f47dc35ee8601419e4902afe523a072c0.svg"
                    />
                  </a>
                  <a href="https://twitter.com/TonyBet">
                    <img
                      alt=""
                      src="/bnl/tonybet18/images/tweet-7cd296a0a788d95d57bb61243a4ccbe719fa2d75e86cf95fceaaaf1119d0e86c.svg"
                    />
                  </a>
                  <a href="https://www.instagram.com/tonybetofficial/">
                    <img
                      alt=""
                      src="/bnl/tonybet18/images/insta-80912f4ddb1f01aecb3ce7a0f9a12d161447b567cf9d281ca646c151c0721bb8.svg"
                    />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-logo">
        <div className="container ml-0">
          <div className="row d-flex justify-content-center">
            <div className="logo-inline d-flex col-12 justify-content-start align-items-center">
              <a href="https://mtr.mkm.ee/juriidiline_isik/96226">
                <img
                  className="img-responsive"
                  src="https://n.tonybet.com/uploads/1/footer_partner/image/83/maksu.png"
                  alt="maksu"
                />
              </a>{' '}
              <a href="https://www.gamblingtherapy.org/en">
                <img
                  className="img-responsive"
                  src="https://n.tonybet.com/uploads/1/footer_partner/image/249/gamblingtherapy.png"
                  alt="GT"
                />
              </a>{' '}
              <a href="/">
                <img
                  className="img-responsive"
                  src="https://n.tonybet.com/uploads/1/footer_partner/image/250/ssl.png"
                  alt="ssl"
                />
              </a>
              <a href="https://www.trustly.com">
                <img
                  className="img-responsive"
                  src="https://n.tonybet.com/uploads/1/footer_partner/image/251/trustly_payment_method_1.png"
                  alt="Trustly"
                />
              </a>{' '}
              <a href="https://www.gamcare.org.uk/">
                <img
                  className="img-responsive"
                  src="https://n.tonybet.com/uploads/1/footer_partner/image/255/gamcare-25x90.png"
                  alt="GamCare"
                />
              </a>{' '}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PageFooter = ({ wrapped }: { wrapped?: boolean }) => {
  return (
    <footer
      className={`d-flex justify-content-center ${
        wrapped ? 'footer-wrapped' : ''
      }`}
    >
      <div className="footer-container py-3">
        <FooterHeader />
        <FooterMenu />
      </div>
    </footer>
  );
};

export default PageFooter;
