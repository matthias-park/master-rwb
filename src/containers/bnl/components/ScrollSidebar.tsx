import React from 'react';
import clsx from 'clsx';
import { Link as ScrollLink } from 'react-scroll';

interface Props {
  links: {
    link: string;
    name: string;
  }[];
  setActive?: (active: string) => void;
  active?: string;
}

const ScrollSidebar = ({ links, setActive, active }: Props) => {
  return (
    <div className="left-sidebar sticky">
      <ul className="sidebar-list">
        {links.map(link => (
          <ScrollLink
            to={link.link}
            smooth={true}
            duration={500}
            spy={true}
            offset={-50}
            onSetActive={() => setActive?.(link.name)}
            onClick={() => setTimeout(() => setActive?.(link.name), 550)}
          >
            <li
              key={link.link}
              className={clsx(
                `sidebar-list__item`,
                active === link.name ? 'active' : 'inactive',
              )}
            >
              <span className="sidebar-list__item-link">{link.name}</span>
            </li>
          </ScrollLink>
        ))}
      </ul>
    </div>
  );
};
export default ScrollSidebar;
