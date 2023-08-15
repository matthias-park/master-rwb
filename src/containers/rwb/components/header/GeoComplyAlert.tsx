import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import useGeoComply from '../../../../hooks/useGeoComply';
import { useI18n } from '../../../../hooks/useI18n';
import { RootState } from '../../../../state';
import { setRetryCount } from '../../../../state/reducers/geoComply';
import CustomAlert from '../CustomAlert';

const StyleRetryText = styled.span`
  cursor: pointer;
  text-decoration: underline;
`;

const GeocomplyAlert = () => {
  const { t } = useI18n();
  const { trigger } = useGeoComply() || {};
  const dispatch = useDispatch();
  const {
    isGeoInProgress,
    errorCode,
    geoValidationInProgress,
    retryCount,
  } = useSelector((state: RootState) => {
    return {
      isGeoInProgress: state.geoComply.geoInProgress,
      errorCode: state.geoComply.error || state.geoComply.savedState?.geoError,
      geoValidationInProgress: state.geoComply.geoValidationInProgress,
      retryCount: state.geoComply.retryCount,
    };
  });

  const RetryBtn = () => {
    if (!errorCode) return null;
    if (retryCount > 2) {
      return <>{t('geo_comply_no_retry')}</>;
    }
    return (
      <StyleRetryText
        className="style-retry-text"
        onClick={() => {
          dispatch(setRetryCount(retryCount + 1));
          trigger?.('manual retry');
        }}
      >
        {t('geo_comply_retry')}
      </StyleRetryText>
    );
  };

  let message: string | React.ReactElement = '';
  if (geoValidationInProgress) message = t('geo_validation_in_progress');
  else if (isGeoInProgress) message = t('geo_comply_in_progress');
  else if (errorCode)
    message = (
      <>
        {t(`geo_comply_failed`)} <RetryBtn />
      </>
    );
  return (
    <>
      {(isGeoInProgress || !!errorCode) && (
        <CustomAlert
          show={true}
          variant={isGeoInProgress ? 'warning' : 'danger'}
          fullScreen
        >
          {message}
        </CustomAlert>
      )}
    </>
  );
};
export default GeocomplyAlert;
