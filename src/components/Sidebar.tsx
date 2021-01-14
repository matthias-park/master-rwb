import React from 'react';
import { useLocation, Link } from 'react-router-dom';

interface Props {
  links: {
    link: string;
    name: string;
  }[];
}

const Sidebar = ({ links }: Props) => {
  const { pathname } = useLocation();

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
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Sidebar;
