import React, { useEffect, useState, useMemo } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import { makeCollapsible } from '../../../utils/uiUtils';
import { useUIConfig } from '../../../hooks/useUIConfig';
import { useI18n } from '../../../hooks/useI18n';
import { useParams, useLocation } from 'react-router-dom';
import ScrollSidebar from '../components/ScrollSidebar';
import HelpBlock from '../components/HelpBlock';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import useApi from '../../../hooks/useApi';
import clsx from 'clsx';
import { Element, Link as ScrollLink } from 'react-scroll';
import RedirectNotFound from '../../../components/RedirectNotFound';
import ContentPage from '../../../types/api/content/ContentPage';
import { useConfig } from '../../../hooks/useConfig';
import { Helmet } from 'react-helmet-async';
import { replaceStringTagsReact } from '../../../utils/reactUtils';
import { getApi } from '../../../utils/apiUtils';
import QuestionsContainer from '../components/account-settings/QuestionsContainer';

const TemplatePage = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { locale } = useConfig((prev, next) => prev.locale === next.locale);
  const { pathname } = useLocation();
  const [active, setActive] = useState('');
  const [dropdownShow, setDropdownShow] = useState(false);
  const page = slug || pathname.substring(1);
  const { headerNav } = useUIConfig();
  const { t } = useI18n();
  const { data, error } = useApi<RailsApiResponse<ContentPage>>(
    [`/restapi/v1/content/page/${page}`, locale],
    url => getApi(url, { cache: 'no-store' }),
  );
  const isDataLoading = !data && !error;
  const [links, setLinks] = useState<{ link: string; name: string }[]>([]);
  const { header } = useConfig();
  const questionItems = useMemo(
    () => [
      {
        title: t('content_page_question_1'),
        body: t('content_page_answer_1'),
      },
      {
        title: t('content_page_question_2'),
        body: t('content_page_answer_2'),
      },
    ],
    [t],
  );

  useEffect(() => {
    makeCollapsible('card', 'collapse', 'card-header');
    if (!!data?.Data?.structure?.content) {
      const menuLinks = data.Data.structure.content
        .slice(1)
        ?.map(el =>
          el.section?.menu_item?.value
            ? {
                link: el.section?.menu_item?.value,
                name: el.section?.menu_item?.value,
              }
            : null,
        )
        .filter(Boolean) as typeof links | undefined;
      setLinks(menuLinks || []);
      const firstMenuItem =
        data.Data?.structure?.content[1]?.section?.menu_item?.value || '';
      setActive(firstMenuItem);
    }
  }, [data]);

  if (!isDataLoading && (error || !data?.Success)) {
    return <RedirectNotFound />;
  }

  const pageTitle =
    data?.Data?.structure?.content?.[0]?.standart?.page_title?.value;

  return (
    <>
      {isDataLoading && (
        <div
          className={clsx(
            'd-flex justify-content-center py-5 mx-auto min-vh-70',
            headerNav.active && 'pt-xl-4',
          )}
        >
          <Spinner
            animation="border"
            variant="black"
            className="mx-auto mt-5"
          />
        </div>
      )}
      {!!pageTitle && (
        <Helmet
          title={`${pageTitle} - ${t('seo_site_name')}`}
          defer={false}
          async
        >
          <meta
            property="og:title"
            content={`${pageTitle} - ${t('seo_site_name')}`}
          />
        </Helmet>
      )}
      {!!data?.Success &&
        (window.__config__.name === 'desertDiamond' ? (
          <main className="container-fluid px-0 px-0 px-sm-4 pl-md-5 mb-4 pt-5">
            <h1 className="account-settings__title">{pageTitle}</h1>
            <div className="outer-info-block">
              {data.Data.structure.content.slice(1).map((el, index) => (
                <div className="mb-3">
                  {!!el.section?.section_title?.value && (
                    <strong>{el.section?.section_title?.value}</strong>
                  )}
                  {!!el.section?.section_content?.value && (
                    <p>
                      {replaceStringTagsReact(el.section.section_content.value)}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <QuestionsContainer items={questionItems} className="mt-5" />
            <HelpBlock
              title={'user_help_title'}
              blocks={['faq', 'phone', 'email']}
              className="d-block d-xl-none"
            />
          </main>
        ) : (
          <div
            className={clsx(
              'page-container justify-content-between',
              header
                ?.slice(1)
                .some(item => item?.prefix?.includes(pathname.split('/')[1])) &&
                'pt-xl-4',
            )}
          >
            <ScrollSidebar
              links={links}
              setActive={setActive}
              active={active}
            />
            <div className="w-100 ml-0 ml-md-5 ml-xl-0 d-flex flex-column flex-xl-row mx-auto">
              <main className="container px-0 px-4 pl-xxl-150 mb-4 pt-4 pt-sm-5">
                {!!data.Data.structure.content && (
                  <>
                    <h1 className="mb-3 text-brand-text mt-xl-2">
                      {pageTitle}
                    </h1>
                    {data.Data.structure.content.slice(1).map((el, index) => (
                      <div key={index}>
                        <Element name={el.section?.menu_item?.value}>
                          <div className="template-page-block pb-3">
                            <h2 className="template-page-block__title">
                              {el.section?.section_title?.value}
                            </h2>
                            {!!el.section?.section_content?.value && (
                              <div className="template-page-block__text mb-3">
                                {replaceStringTagsReact(
                                  el.section.section_content.value,
                                )}
                              </div>
                            )}
                            <img
                              alt=""
                              className="template-page-block__img"
                              src={el.section?.section_image_url?.value}
                            />
                          </div>
                        </Element>
                        {index === 0 &&
                          data.Data.structure.content.length > 1 &&
                          data.Data.structure.content[0].standart
                            ?.dropdown_button_translations && (
                            <Dropdown
                              className="custom-dropdown mb-3 d-block d-md-none"
                              show={dropdownShow}
                              onToggle={() => setDropdownShow(!dropdownShow)}
                            >
                              <Dropdown.Toggle
                                variant="brand-light"
                                id="dropdown-basic"
                              >
                                {data.Data.structure.content[0].standart
                                  ?.dropdown_button_translations?.value ||
                                  t('default_dropdown_title')}
                                <i
                                  className={clsx(
                                    `icon-${window.__config__.name}-down1`,
                                  )}
                                ></i>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                {links.map(link => (
                                  <Dropdown.Item
                                    className="text-wrap"
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
                  </>
                )}
              </main>
              <div className="right-sidebar px-4 px-xl-0">
                <HelpBlock
                  title={'user_help_title'}
                  blocks={['faq', 'phone', 'email']}
                  className="default mx-auto mx-md-0"
                />
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default TemplatePage;
