import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import { FOOTER_LINKS } from '../../constants';
import FooterLink from '../../types/FooterLink';

const CopyWrite = () => (
  <div className="footer-copyright d-flex align-items-center order-4 order-lg-1 flex-grow-1 flex-lg-grow-0 my-1">
    <img
      alt="18_mini"
      className="mx-1"
      data-html="true"
      data-placement="top"
      data-toggle="tooltip"
      height="24"
      src="/assets/images/footer/18_mini.png"
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
  const ref = useRef<HTMLDivElement | null>(null);
  const { locale, locales, setLocale } = useConfig();
  const [showLocaleMenu, setShowLocaleMenu] = useState(false);
  useOnClickOutside(ref, () => setShowLocaleMenu(false));
  return (
    <div className="footer-button-wrapper d-flex flex-wrap order-2 flex-grow-1">
      <div className="mobile-apps d-flex order-1 order-lg-2 my-1 ml-lg-auto">
        <a
          href="http://android.tonybet.com/TonyBet.apk"
          className="btn btn-opacity mx-1 d-flex align-items-center"
        >
          <img
            alt="Android"
            src="/assets/images/theme15/images/footer/phone-android.png"
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
        <div ref={ref} className="dropdown language order-3">
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
            {locales.map(lang => (
              <div
                className={`lang-${lang} dropdown-item`}
                key={lang}
                onClick={() => {
                  setLocale(lang);
                  setShowLocaleMenu(false);
                }}
              >
                {lang}
              </div>
            ))}
          </div>
        </div>
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

const FooterMenu = () => {
  const footerLinks: FooterLink[] = FOOTER_LINKS;
  return (
    <div className="footer-menu">
      <div className="d-flex flex-column">
        <div className="footer-disclaimer d-flex flex-wrap my-1 text-read-more collapsed">
          <p>
            <span></span>
          </p>
          <p>
            Gambling is not a proper way to solve your financial problems.
            Please read the terms and act responsibly. 18+ only, T&amp;Cs apply.
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
          {footerLinks
            .sort((a, b) => a.order - b.order)
            .map(column => {
              const oneColumn = column.children.length < 5;
              const sortedChildren = column.children.sort(
                (a, b) => a.order - b.order,
              );
              return (
                <div className={`col-4 col-md-${oneColumn ? 2 : 3}`}>
                  <h4>{column.name}</h4>
                  <div className={!oneColumn ? 'row' : ''}>
                    {new Array(Math.round(sortedChildren.length / 4))
                      .fill(null)
                      .map((_, index) => {
                        const children = sortedChildren.slice(
                          4 * index,
                          4 * (index + 1),
                        );
                        return (
                          <div className="col-12 col-md-6">
                            <ul>
                              {children.map(link => (
                                <li>
                                  {link.link ? (
                                    <Link to={link.link}>{link.name}</Link>
                                  ) : (
                                    link.name
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
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
};
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
