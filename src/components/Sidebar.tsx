import React from 'react';
import { useLocation } from 'react-router-dom';
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
  setActive?: (active: string) => void;
  active?: string;
}

const Sidebar = ({ links, scroll, setActive, active }: Props) => {
  const { pathname } = useLocation();
  const { t } = useI18n();

  return (
    <div className="left-sidebar sticky">
      <ul className="sidebar-list">
        {links.map(link => (
          <>
            {scroll ? (
              <li
                key={link.link}
                className={clsx(
                  `sidebar-list__item`,
                  active === link.name ? 'active' : 'inactive',
                )}
              >
                <ScrollLink
                  to={link.link}
                  className="sidebar-list__item-link"
                  smooth={true}
                  duration={500}
                  spy={true}
                  offset={-50}
                  onSetActive={() => setActive?.(link.name)}
                  onClick={() => setTimeout(() => setActive?.(link.name), 550)}
                >
                  {link.name}
                </ScrollLink>
              </li>
            ) : (
              <li
                key={link.link}
                className={clsx(
                  `sidebar-list__item`,
                  link.link === pathname ? 'active' : 'inactive',
                )}
              >
                <Link to={link.link} className="sidebar-list__item-link">
                  {t(link.name)}
                </Link>
              </li>
            )}
          </>
        ))}
      </ul>
    </div>
  );
};
export default Sidebar;
