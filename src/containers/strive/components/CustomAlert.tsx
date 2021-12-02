import React from 'react';
import Alert, { AlertProps } from 'react-bootstrap/Alert';
import clsx from 'clsx';
import { Config } from '../../../constants';

const CustomAlert = ({ variant, show, children, className }: AlertProps) => {
  return (
    <Alert
      show={show}
      className={clsx('custom-alert', `custom-alert--${variant}`, className)}
    >
      <div className="custom-alert__icon">
        <i className={`icon-${Config.name}-${variant}`}></i>
      </div>
      <p className="custom-alert__content">{children}</p>
    </Alert>
  );
};

export default CustomAlert;
