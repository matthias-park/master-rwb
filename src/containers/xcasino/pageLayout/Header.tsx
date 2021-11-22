import React from 'react';
import Button from 'react-bootstrap/Button';
import clsx from 'clsx';
import { useAuth } from '../../../hooks/useAuth';
import { ComponentName } from '../../../constants';
import { useModal } from '../../../hooks/useModal';
import SessionTimer from '../components/SessionTimer';
interface HeaderProps {
  sidebarState: boolean;
  toggleSidebar: (state: boolean) => void;
}

const Header = ({ sidebarState, toggleSidebar }: HeaderProps) => {
  const { enableModal } = useModal();
  const { user } = useAuth();

  return (
    <header className={clsx('header', sidebarState && 'hide')}>
      <i
        className="header__toggler icon-nav"
        onClick={() => toggleSidebar(!sidebarState)}
      ></i>
      <h5 className="brand-title">Casino site</h5>
      {!user.logged_in ? (
        <Button
          className="header__button rounded-pill"
          variant="secondary"
          size="sm"
          onClick={() => enableModal(ComponentName.RegisterModal)}
        >
          Register
        </Button>
      ) : (
        <SessionTimer />
      )}
    </header>
  );
};

export default Header;
