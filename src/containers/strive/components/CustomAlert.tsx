import React from 'react';
import Alert, { AlertProps } from 'react-bootstrap/Alert';
import clsx from 'clsx';

interface CustomAlertProps extends AlertProps {
  fullScreen?: boolean;
}

const CustomAlert = ({
  variant,
  show,
  children,
  className,
  fullScreen,
}: CustomAlertProps) => {
  return (
    <Alert
      show={show}
      className={clsx(
        'custom-alert',
        `custom-alert--${variant}`,
        className,
        fullScreen && 'full-screen',
        'text-center',
      )}
    >
      <div className="custom-alert__icon">
        <i className={`icon-${variant}`}></i>
      </div>
      <p className="custom-alert__content">{children}</p>
    </Alert>
  );
};

export default CustomAlert;
