import React from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import Link from './Link';

interface Props {
  links: {
    link: string;
    name: string;
  }[];
}

const Sidebar = ({ links }: Props) => {
  const { pathname } = useLocation();
  const { t } = useI18n();
  return (
    <div className="left-sidebar">
      <ul className="sidebar-list">
        {links.map(link => (
          <li
            key={link.link}
            className={`sidebar-list__item ${
              link.link === pathname ? 'sidebar-list__item-link--active' : ''
            }`}
          >
            <Link to={link.link} className="sidebar-list__item-link">
              {t(link.name)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Sidebar;
