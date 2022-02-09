import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../../../hooks/useAuth';
import useGeoComply from '../../../../hooks/useGeoComply';
import { useI18n } from '../../../../hooks/useI18n';
import useLocalStorage from '../../../../hooks/useLocalStorage';
import CustomAlert from '../CustomAlert';

const StyleRetryText = styled.span`
  cursor: pointer;
  text-decoration: underline;
`;

const GeocomplyAlert = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [retryCount, setRetryCount] = useLocalStorage('geocomplyRetryCount', 0);
  const { isGeoInProgress, errorCode, geoValidationInProgress, trigger } =
    useGeoComply() || {};

  useEffect(() => {
    if (!user.logged_in) {
      setRetryCount(0);
    }
  }, [user.logged_in]);

  const RetryBtn = () => {
    if (!errorCode) return null;
    if (retryCount > 2) {
      return <>{t('geo_comply_no_retry')}</>;
    }
    return (
      <StyleRetryText
        onClick={() => {
          setRetryCount(retryCount + 1);
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
