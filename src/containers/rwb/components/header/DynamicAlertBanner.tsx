import React from 'react';
import { Button } from 'react-bootstrap';
import { useI18n } from '../../../../hooks/useI18n';
import CustomAlert from '../CustomAlert';

interface Props {
  show: boolean;
  variant: string;
  message: string;
  buttonOnClick?: () => void | undefined;
  buttonTitle?: string | undefined;
}

const DynamicAlertBanner = ({
  show,
  variant,
  message,
  buttonTitle,
  buttonOnClick,
}: Props) => {
  const { t } = useI18n();

  if (!show) return null;
  return (
    <CustomAlert show={true} variant={variant} fullScreen={true}>
      <div className="d-flex align-items-center">
        {t(message)}
        {buttonTitle && buttonOnClick && (
          <Button className="ml-auto" onClick={buttonOnClick}>
            {buttonTitle}
          </Button>
        )}
      </div>
    </CustomAlert>
  );
};

export default DynamicAlertBanner;
