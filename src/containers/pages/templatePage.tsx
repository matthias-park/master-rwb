import React, { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import JsonPage from '../../types/api/JsonPage';
import { makeCollapsible } from '../../utils/uiUtils';
import { useParams, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import NotFoundPage from './notFoundPage';
import Sidebar from '../../components/Sidebar';
import HelpBlock from '../../components/HelpBlock';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import useApi from '../../hooks/useApi';
import { Element, Link as ScrollLink } from 'react-scroll';

const TemplatePage = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { pathname } = useLocation();
  const [active, setActive] = useState('section1');
  const [dropdownShow, setDropdownShow] = useState(false);
  const page = slug || pathname.substring(1).replaceAll('/', '_');
  const { data, error } = useApi<RailsApiResponse<JsonPage>>(
    `/railsapi/v1/content/page/${page}`,
  );
  const isDataLoading = !data && !error;

  useEffect(() => {
    makeCollapsible('card', 'collapse', 'card-header');
  }, [data]);

  if (!isDataLoading && (error || !data?.Success)) {
    return <NotFoundPage />;
  }

  const links = [
    { link: 'section1', name: 'section1' },
    { link: 'section2', name: 'section2' },
    { link: 'section3', name: 'section3' },
  ];

  return (
    <div className="page-container justify-content-between">
      {isDataLoading && (
        <div className="d-flex justify-content-center pt-4 pb-3 mx-auto">
          <Spinner animation="border" variant="black" className="mx-auto" />
        </div>
      )}
      {!!data && (
        <>
          <Sidebar
            links={links}
            scroll={true}
            onClick={setActive}
            active={active}
          />
          <div className="ml-0 ml-md-5 ml-xl-0 d-flex flex-column flex-xl-row mx-auto">
            <main className="container px-0 px-4 pl-xxl-150 mb-4 pt-4 pt-sm-5">
              <h1 className="mb-3 text-brand-text">
                {data.Data.title || data.Data.headline}
              </h1>
              <Element name="section1">
                <div className="template-page-block pb-3">
                  <h2 className="template-page-block__title">
                    Scooore steunt sporters, teams én competities
                  </h2>
                  <p className="template-page-block__text mb-3">
                    Reken de Nationale Loterij gerust bij de belangrijkste
                    sponsors in ons land. En met Scooore ondersteunen we
                    sportclubs en sportieve evenementen. We investeren in
                    professionele sport, maar net zo goed in lokale
                    initiatieven. Vooral voetbal laat ons hart sneller slaan. Zo
                    zijn we naast financiële partner, tegelijk ook de grootste
                    fans van spelers en teams.
                  </p>
                  <div style={{ height: '300px', background: 'blue' }}></div>
                </div>
              </Element>
              <Dropdown
                className="custom-dropdown mb-3 d-block d-md-none"
                show={dropdownShow}
                onToggle={() => setDropdownShow(!dropdownShow)}
              >
                <Dropdown.Toggle variant="brand-light" id="dropdown-basic">
                  Dropdown Button
                  <i className="icon-down1"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {links.map(link => (
                    <Dropdown.Item
                      as={ScrollLink}
                      key={link.link}
                      to={link.link}
                      smooth={true}
                      onClick={() => setDropdownShow(false)}
                    >
                      {link.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Element name="section2">
                <div className="template-page-block pb-3">
                  <h2 className="template-page-block__title">
                    Scooore steunt sporters, teams én competities
                  </h2>
                  <p className="template-page-block__text mb-3">
                    Reken de Nationale Loterij gerust bij de belangrijkste
                    sponsors in ons land. En met Scooore ondersteunen we
                    sportclubs en sportieve evenementen. We investeren in
                    professionele sport, maar net zo goed in lokale
                    initiatieven. Vooral voetbal laat ons hart sneller slaan. Zo
                    zijn we naast financiële partner, tegelijk ook de grootste
                    fans van spelers en teams.
                  </p>
                  <div style={{ height: '300px', background: 'blue' }}></div>
                </div>
              </Element>
              <Element name="section3">
                <div className="template-page-block pb-3">
                  <h2 className="template-page-block__title">
                    Scooore steunt sporters, teams én competities
                  </h2>
                  <p className="template-page-block__text mb-3">
                    Reken de Nationale Loterij gerust bij de belangrijkste
                    sponsors in ons land. En met Scooore ondersteunen we
                    sportclubs en sportieve evenementen. We investeren in
                    professionele sport, maar net zo goed in lokale
                    initiatieven. Vooral voetbal laat ons hart sneller slaan. Zo
                    zijn we naast financiële partner, tegelijk ook de grootste
                    fans van spelers en teams.
                  </p>
                  <div style={{ height: '300px', background: 'blue' }}></div>
                </div>
              </Element>
            </main>
            <div className="right-sidebar px-4 px-xl-0">
              <HelpBlock
                title={'user_help_title'}
                blocks={['phone']}
                className={'default'}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TemplatePage;
