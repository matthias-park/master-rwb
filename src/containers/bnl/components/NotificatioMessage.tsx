import React from 'react';

const NotificationMessage = ({ title, text }) => {
  return (
    <div className="notification-message">
      <i className="notification-message__close icon-close"></i>
      <div className="notification-message__info-icon"></div>
      <div className="notification-message__text">
        <p className="notification-message__text-title">{title}</p>
        <p className="notification-message__text-main">{text}</p>
      </div>
    </div>
  );
};

export default NotificationMessage;
