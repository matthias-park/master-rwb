import React, { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import JsonPageTemplate from '../../types/api/JsonPageTemplate';
import { makeCollapsible } from '../../utils/uiUtils';
import { useParams, useLocation } from 'react-router-dom';
import NotFoundPage from './notFoundPage';
import Sidebar from '../../components/Sidebar';
import HelpBlock from '../../components/HelpBlock';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import useApi from '../../hooks/useApi';
import { Element, Link as ScrollLink } from 'react-scroll';

const TemplatePage = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { pathname } = useLocation();
  const [active, setActive] = useState('');
  const [dropdownShow, setDropdownShow] = useState(false);
  const page = slug || pathname.substring(1).replaceAll('/', '_');
  const { data, error } = useApi<RailsApiResponse<JsonPageTemplate>>(
    `/railsapi/v1/content/page/${page}`,
  );
  const isDataLoading = !data && !error;
  const [links, setLinks] = useState<{ link: string; name: string }[]>([]);

  useEffect(() => {
    makeCollapsible('card', 'collapse', 'card-header');
    if (data !== undefined) {
      const menuLinks = data?.Data.structure.content.slice(1).map(el => ({
        link: el.section.menu_item.value,
        name: el.section.menu_item.value,
      }));
      setLinks(menuLinks);
      setActive(data.Data.structure.content[1].section?.menu_item.value);
    }
  }, [data]);

  if (!isDataLoading && (error || !data?.Success)) {
    return <NotFoundPage />;
  }

  return (
    <div className="page-container justify-content-between">
      {isDataLoading && (
        <div className="d-flex justify-content-center pt-4 pb-3 mx-auto">
          <Spinner animation="border" variant="black" className="mx-auto" />
        </div>
      )}
      {!!data && links && (
        <>
          <Sidebar
            links={links}
            scroll={true}
            onClick={setActive}
            active={active}
          />
          <div className="w-100 ml-0 ml-md-5 ml-xl-0 d-flex flex-column flex-xl-row mx-auto">
            <main className="container px-0 px-4 pl-xxl-150 mb-4 pt-4 pt-sm-5">
              <h1 className="mb-3 text-brand-text">
                {data.Data.structure.content[0].standart?.page_title.value}
              </h1>
              {data.Data.structure.content.slice(1).map((el, index) => (
                <div key={index}>
                  <Element name={el.section?.menu_item.value}>
                    <div className="template-page-block pb-3">
                      <h2 className="template-page-block__title">
                        {el.section?.section_title.value}
                      </h2>
                      <p className="template-page-block__text mb-3">
                        {el.section?.section_content.value}
                      </p>
                      <img src={el.section?.section_image_url.value} />
                    </div>
                  </Element>
                  {index == 0 && (
                    <Dropdown
                      className="custom-dropdown mb-3 d-block d-md-none"
                      show={dropdownShow}
                      onToggle={() => setDropdownShow(!dropdownShow)}
                    >
                      <Dropdown.Toggle
                        variant="brand-light"
                        id="dropdown-basic"
                      >
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
                  )}
                </div>
              ))}
            </main>
            <div className="right-sidebar px-4 px-xl-0">
              <HelpBlock
                title={'user_help_title'}
                blocks={['phone']}
                className={'default mx-auto mx-md-0'}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TemplatePage;
