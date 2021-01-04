import React, { useRef, useState } from 'react';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const UserMenuLink = ({ link, icon, name }) => (
  <Link
    to={link}
    className="menu__blocks--item d-flex flex-column align-items-center align-items-xl-start justify-content-center"
  >
    <i className={`icon-${icon} mb-1 d-xl-none`}></i>
    <span>{name}</span>
  </Link>
);

const HeaderUserInfo = ({ user, handleLogout }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  useOnClickOutside(ref, () => setShowMenu(false));
  return (
    <div className="menu__blocks d-flex order-xl-6 order-4 ">
      <Link
        to="/deposit"
        className="btn-group btn-deposit justify-content-center flex-md-grow d-none d-xl-flex"
      >
        <button
          name="button"
          type="button"
          className="btn btn-violet btn-violet-dark with-border balance"
        >
          {user.balance}
        </button>
        <button
          name="button"
          type="button"
          className="btn btn-violet with-border d-flex align-items-center"
        >
          <i className="icon-bank-card"></i>Deposit
        </button>
      </Link>
      <button
        name="button"
        type="button"
        className="btn btn-opacity dropdown-toggle btn-acc btn-acc--hideBalance d-flex align-items-center collapsed"
        id="navbarAccCollapseToggle"
        data-toggle="collapse"
        data-target="#navbarAccCollapseContent"
        aria-expanded="true"
        aria-controls="navbarAccCollapseContent"
        onClick={() => setShowMenu(!showMenu)}
      >
        <span className="mobile-balance pr-1 d-xl-none">{user.balance}</span>
        <i className="icon-head"></i>
      </button>
      <div
        ref={ref}
        className={clsx(
          'menu__blocks--container account mr-xl-2 collapse',
          showMenu && 'show',
        )}
        id="navbarAccCollapseContent"
      >
        <div className="">
          <div className="user-navigation d-flex flex-wrap flex-xl-column ">
            {[
              {
                link: '/deposit',
                icon: 'wallet',
                name: 'Deposit',
              },
              {
                link: '/bonus',
                icon: 'betslip',
                name: 'Bonus',
              },
              {
                link: '/limits',
                icon: 'transactions',
                name: 'Limits',
              },
              {
                link: '/withdrawal',
                icon: 'bonus',
                name: 'Withdrawal',
              },
              {
                link: '/settings',
                icon: 'money',
                name: 'Settings',
              },
            ].map(link => (
              <UserMenuLink
                key={link.link}
                link={link.link}
                icon={link.icon}
                name={link.name}
              />
            ))}
            <div
              className="menu__blocks--item padding-top  d-flex flex-column align-items-center align-items-xl-start justify-content-center cursor-pointer"
              onClick={handleLogout}
            >
              <i className="icon-wrong mb-1 d-xl-none"></i>
              <span>Log Out</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderUserInfo;
