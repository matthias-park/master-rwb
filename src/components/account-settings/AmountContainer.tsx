import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const AmountContainer = ({ title, amount }) => {
  return (
    <div className="amount-container mb-4">
      <small className="amount-container__text">{title}</small>
      <h2 className="amount-container__amount">€ {amount}</h2>
      <OverlayTrigger
        placement={'bottom'}
        overlay={<Tooltip id="tooltip_amount">Tooltip for amount</Tooltip>}
      >
        <i className="amount-container__icon icon-tooltip"></i>
      </OverlayTrigger>
    </div>
  );
};

export default AmountContainer;
