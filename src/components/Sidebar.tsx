import React from 'react';
import { useLocation, Link } from 'react-router-dom';

interface Props {
  links: {
    link: string;
    icon: string;
    name: string;
  }[];
}

const Sidebar = ({ links }: Props) => {
  const { pathname } = useLocation();

  return (
    <div
      className="no-left-menu d-xl-block left-sidebar collapse"
      id="leftMenu"
    >
      <div
        className="avatar"
        style={{
          backgroundImage:
            "url('https://en.tonybet.com/uploads/player_data/5/f95773a868da9392dd9b23f32bfada28a7536c90-en.jpg')",
        }}
      ></div>

      <div className="left-menu-holder p-3 hide-scrollbars">
        <ul className="list-unstyled">
          {links.map(link => (
            <li className={link.link === pathname ? 'active' : ''}>
              <Link to={link.link}>
                <div
                  className={`category-title ${
                    link.link === pathname ? 'active' : ''
                  }`}
                >
                  <i className={`icon-${link.icon}`}></i>
                  {link.name}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Sidebar;
