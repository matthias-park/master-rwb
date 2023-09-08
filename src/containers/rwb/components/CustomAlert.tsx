import React from 'react';
import Alert, { AlertProps } from 'react-bootstrap/Alert';
import { ThemeSettings } from '../../../constants';
import clsx from 'clsx';

interface CustomAlertProps extends AlertProps {
  fullScreen?: boolean;
  variant?: string;
}

const CustomAlert = ({
  variant,
  show,
  children,
  className,
  fullScreen,
}: CustomAlertProps) => {
  const { icons: icon } = ThemeSettings!;
  return (
    <Alert
      show={show}
      className={clsx(
        'custom-alert',
        `custom-alert--${variant}`,
        className,
        fullScreen && 'full-screen',
      )}
    >
      <div className="custom-alert__icon">
        <i className={clsx(icon?.[variant || `icon-${variant}`])}></i>
      </div>
      <p className="custom-alert__content">{children}</p>
    </Alert>
  );
};

export default CustomAlert;
