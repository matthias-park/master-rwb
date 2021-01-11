import React from 'react';

const AmountContainer = ({ title, amount }) => {
  return (
    <div className="amount-container mb-4">
      <small className="amount-container__text">{title}</small>
      <h2 className="amount-container__amount">€ {amount}</h2>
      <i className="amount-container__icon icon-tooltip"></i>
    </div>
  )
}

export default AmountContainer;