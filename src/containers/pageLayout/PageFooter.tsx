import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../../hooks/useConfig';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import { FOOTER_LINKS } from '../../constants';
import FooterLink from '../../types/FooterLink';
import Dropdown from 'react-bootstrap/Dropdown';

const FooterHeader = () => {
  return (
    <div className="row footer-pre py-3">
      <div className="session-block mb-2 mb-sm-0">
          <span className="session-block__text text-14">Tijd besteed op nationale-loterij.be:</span>
          <i className="icon-clock"></i>
          <span className="session-block__time text-14">00:20:15</span>
      </div>
      <div className="restrictions-block ml-md-auto">
          <img className="restrictions-block__img d-none d-sm-block d-md-none d-lg-block"
               src="/assets/images/restrictions/18-label.png" width="37" height="37"/>
          <span className="restrictions-block__text text-14 mr-3 d-none d-sm-block d-md-none d-lg-block">
            Minderjarigen mogen niet deelnemen aan de spelen van de Nationale Loterij.
          </span>
          <img className="restrictions-block__img mr-3" src="/assets/images/restrictions/bnl.png"
               width="190" height="45"/>
          <img className="restrictions-block__img" src="/assets/images/restrictions/becommerce.png"
               width="65" height="65" />
      </div>
    </div>
  );
};

const FooterBottom = () => {
  return (
    <div className="row no-gutters footer-sub">
      <span className="footer-sub__title d-none d-lg-inline-block">®2018 Nationale Loterij</span>
      <ul className="footer-sub__nav ml-auto">
          <li className="footer-sub__nav-link">Algemene voorwaarden</li>
          <li className="footer-sub__nav-link">Gebruiksvoorwaarden</li>
          <li className="footer-sub__nav-link">Cookiebeleid</li>
          <li className="footer-sub__nav-link">Certificaten en gedragscodes</li>
          <li className="footer-sub__nav-link">Sitemap</li>
          <li className="footer-sub__nav-link d-flex d-lg-none">®2018 Nationale Loterij</li>
      </ul>
    </div>
  )
}

const SocialSection = () => {
  return (
    <section className="footer-social-block pt-4 mt-0 mt-md-4 mt-lg-0 pt-lg-0">
      <div className="section-social">
          <h2 className="section-social__head-title">Altijd op de hoogte</h2>
          <p className="section-social__title font-weight-500">Download de app</p>
          <div className="section-social__app-img-cont">
              <img src="/assets/images/app/ios.png" className="section-social__app-img-cont-img mr-2 mr-sm-3"
                   width="120" height="40"></img>
              <img src="/assets/images/app/android.png" className="section-social__app-img-cont-img"
                   width="120" height="40"></img>
          </div>
          <p className="section-social__title">Vind ons ook op</p>
          <p className="section-social__icons">
              <a href="#" className="section-social__icons-link"><i className="icon-mail2"></i></a>
              <a href="#" className="section-social__icons-link"><i className="icon-facebook"></i></a>
              <a href="#" className="section-social__icons-link"><i className="icon-youtube"></i></a>
              <a href="#" className="section-social__icons-link"><i className="icon-twitter"></i></a>
              <a href="#" className="section-social__icons-link"><i className="icon-nsta"></i></a>
              <a href="#" className="section-social__icons-link"><i className="icon-linkedin"></i></a>
          </p>
      </div>
    </section>
  )
}

const SortedFooterLinks = () => {
  const footerLinks: FooterLink[] = FOOTER_LINKS;
  let skipColumns: FooterLink[] = [];
  return (
    <>
      {footerLinks
        .sort((a, b) => a.order - b.order)
        .flatMap((column, index) => {
          if (skipColumns.some((skip) => (skip.name === column.name))) {
            return [];
          } else {
            const oneRow = column.children.length > 4;
            let mergedColumns = [column];
            if (!oneRow) {
              let columnsChildrenLength = column.children.length;
              while (columnsChildrenLength < 4) {
                columnsChildrenLength += footerLinks[index + mergedColumns.length].children.length;
                skipColumns.push(footerLinks[index + mergedColumns.length]);
                mergedColumns = [...mergedColumns, footerLinks[index + mergedColumns.length]];
              }
            }
            return <section className="footer-links-block">
                    {mergedColumns.map(mergedColumn => {
                      const sortedChildren = mergedColumn.children.sort(
                        (a, b) => a.order - b.order,
                      );
                      return (window.innerWidth < 767.8 ?
                        <Dropdown className="section-item">
                          <Dropdown.Toggle as="h3" className="section-item__title">{mergedColumn.name}</Dropdown.Toggle>
                          <Dropdown.Menu>
                            {sortedChildren.map((child) => {
                              return (!child.button ? 
                                <a href={child.link} className="section-item__link">{child.name}</a> :
                                <a href="#" className="btn btn-outline-gray-700 btn-sm my-3">{child.name}</a>
                              )
                            })}
                          </Dropdown.Menu>
                        </Dropdown>
                        :
                        <div className="section-item">
                          <h3 className="section-item__title">{mergedColumn.name}</h3>
                          <div>
                            {sortedChildren.map((child) => {
                              return (!child.button ? 
                                <a href={child.link} className="section-item__link">{child.name}</a> :
                                <a href="#" className="btn btn-outline-gray-700 btn-sm my-3">{child.name}</a>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </section>
          }
        })}
    </>
  )
}

const PageFooter = () => {
  return (
    <footer>
      <div className="container-fluid">
        <FooterHeader />
        <div className="row footer-main pt-0 pt-md-4 pb-2 py-lg-4">
          <SortedFooterLinks/>
          <SocialSection/>
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
};

export default PageFooter;
