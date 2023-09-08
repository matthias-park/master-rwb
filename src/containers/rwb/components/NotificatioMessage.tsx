import React from 'react';
import { ThemeSettings } from '../../../constants';
import clsx from 'clsx';

const NotificationMessage = ({ title, text }) => {
  const { icons: icon } = ThemeSettings!;
  return (
    <div className="notification-message">
      <i className={clsx('notification-message__close', icon?.close)}></i>
      <div className="notification-message__info-icon"></div>
      <div className="notification-message__text">
        <p className="notification-message__text-title">{title}</p>
        <p className="notification-message__text-main">{text}</p>
      </div>
    </div>
  );
};

export default NotificationMessage;
