import clsx from 'clsx';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

const RewardsFilter = () => {
  const { category } = useParams<{ category: string }>();
  return (
    <>
      <div className="rewards-filter">
        <ul className="rewards-filter__categories">
          <Link to="/rewards/redeem/all">
            <li
              className={clsx(
                'rewards-filter__categories-item',
                category === 'all' && 'active',
              )}
            >
              <i className="icon-games" />
              Show All
            </li>
          </Link>
          <Link to="/rewards/redeem/spins">
            <li
              className={clsx(
                'rewards-filter__categories-item',
                category === 'spins' && 'active',
              )}
            >
              <i className="icon-free-spins" />
              Free Spins
            </li>
          </Link>
          <Link to="/rewards/redeem/bonus">
            <li
              className={clsx(
                'rewards-filter__categories-item',
                category === 'bonus' && 'active',
              )}
            >
              <i className="icon-bonuses" />
              Bonuses
            </li>
          </Link>
          <Link to="/rewards/redeem/cash">
            <li
              className={clsx(
                'rewards-filter__categories-item',
                category === 'cash' && 'active',
              )}
            >
              <i className="icon-cash" />
              Cash
            </li>
          </Link>
        </ul>
      </div>
      <div className="rewards-filter__token-counter">
        <div className="rewards-filter__token-counter-text-wrp">
          <h3 className="rewards-filter__token-counter-title">218</h3>
          <p className="rewards-filter__token-counter-text">Tokens</p>
        </div>
        <i className="icon-tokens"></i>
      </div>
    </>
  );
};

export default RewardsFilter;
