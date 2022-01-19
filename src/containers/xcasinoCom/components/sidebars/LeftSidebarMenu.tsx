import React from 'react';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import Link from '../../../../components/Link';
import { useI18n } from '../../../../hooks/useI18n';
import { useLocation } from 'react-router';
import { useModal } from '../../../../hooks/useModal';
import { ComponentName } from '../../../../constants';
import { useDispatch } from 'react-redux';
import { setShowBettingHistory } from '../../../../state/reducers/tgLabSb';

interface LeftSidebarMenuProps {
  goBack: () => void;
  items: {
    icon?: string;
    title: string;
    link?: string;
    modal?: string;
    onClick?: () => void;
  }[];
}

const LeftSidebarMenu = ({ goBack, items }: LeftSidebarMenuProps) => {
  const dispatch = useDispatch();
  const { t } = useI18n();
  const { enableModal } = useModal();
  const { pathname } = useLocation();

  return (
    <div className={clsx('sidebar-left__content-block')}>
      <Button
        onClick={() => goBack()}
        variant="gray-700 w-100 rounded-pill sidebar-left__content-block-back"
      >
        <i className="icon-left"></i>Back
      </Button>
      <hr className="divider"></hr>
      <ul className="vr-nav vr-nav--dark">
        {items?.map(item => {
          let onClick = item.onClick;
          if (item.modal) {
            onClick = () => {
              if (ComponentName.BettingHistory === item.modal) {
                dispatch(setShowBettingHistory(true));
              } else {
                enableModal(item.modal as ComponentName);
              }
            };
          }
          if (onClick && !item.link) {
            return (
              <span onClick={onClick} key={item.title}>
                <li className="vr-nav__item">
                  {item.icon && (
                    <i className={clsx('vr-nav__item-icon', item.icon)}></i>
                  )}
                  <span className="vr-nav__item-title">{t(item.title)}</span>
                </li>
              </span>
            );
          }
          return (
            <Link key={item.title} onClick={onClick} to={item.link || '#'}>
              <li
                className={clsx(
                  item.link === pathname && 'active',
                  'vr-nav__item',
                )}
              >
                {item.icon && (
                  <i className={clsx('vr-nav__item-icon', item.icon)}></i>
                )}
                <span className="vr-nav__item-title">{t(item.title)}</span>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default LeftSidebarMenu;
