import React from 'react';
import Main from '../pageLayout/Main';
import RedirectNotFound from '../../../components/RedirectNotFound';
import { useParams } from 'react-router-dom';
import { replaceStringTagsReact } from '../../../utils/reactUtils';
import useApi from '../../../hooks/useApi';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import ContentPage from '../../../types/api/content/ContentPage';
import { Spinner } from 'react-bootstrap';
import { useI18n } from '../../../hooks/useI18n';

const InfoTemplatePage = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { data, error } = useApi<RailsApiResponse<ContentPage>>(
    !!slug ? `/restapi/v1/content/page/${slug}` : null,
  );

  const isDataLoading = !data && !error;
  const { t } = useI18n();
  if (!isDataLoading && (error || !data?.Success)) {
    return <RedirectNotFound />;
  }

  const pageTitle =
    data?.Data?.structure?.content?.[0]?.section?.page_title?.value;

  const sections = data?.Data.structure.content;

  return (
    <div>
      {isDataLoading && (
        <div className="d-flex justify-content-center py-5 mx-auto min-vh-70">
          <Spinner
            animation="border"
            variant="black"
            className="mx-auto mt-5"
          />
        </div>
      )}
      {!isDataLoading && !!data?.Success && (
        <Main
          title={t('info_page_title')}
          icon="icon-circle-info"
          className="info-template-page"
        >
          <div className="info-template-page__content container">
            <h4 className="info-template-page__title">{pageTitle}</h4>
            {sections?.map(content => {
              return (
                <div className="info-template-page__section">
                  {!!content.section?.section_title?.value && (
                    <h6 className="info-template-page__section-title">
                      {content.section.section_title.value}
                    </h6>
                  )}
                  {replaceStringTagsReact(
                    String(content.section?.section_content.value),
                  )}
                </div>
              );
            })}
          </div>
        </Main>
      )}
    </div>
  );
};

export default InfoTemplatePage;
