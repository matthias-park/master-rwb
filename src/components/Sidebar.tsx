import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import clsx from 'clsx';
import { Link as ScrollLink } from 'react-scroll';
import { useI18n } from '../hooks/useI18n';
import Link from './Link';

interface Props {
  links: {
    link: string;
    name: string;
  }[];
  scroll?: boolean;
  onClick?: (active: string) => void;
  active?: string;
}

const Sidebar = ({ links, scroll, onClick, active }: Props) => {
  const { pathname } = useLocation();
  const { t } = useI18n();

  return (
    <div className="left-sidebar sticky">
      <ul className="sidebar-list">
        {links.map(link => (
          <li key={link.link} className={`sidebar-list__item`}>
            {scroll ? (
              <ScrollLink
                to={link.link}
                className={clsx(
                  'sidebar-list__item-link',
                  active === link.name ? 'active' : 'inactive',
                )}
                smooth={true}
                duration={500}
                activeClass="active"
                spy={true}
                offset={-10}
                onSetActive={() => onClick?.(link.name)}
                onClick={() => setTimeout(() => onClick?.(link.name), 550)}
              >
                {link.name}
              </ScrollLink>
            ) : (
              <Link
                to={link.link}
                className={clsx(
                  'sidebar-list__item-link',
                  link.link === pathname ? 'active' : '',
                )}
              >
                {t(link.name)}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Sidebar;
