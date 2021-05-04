import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useI18n } from '../hooks/useI18n';
import Link from './Link';
import Accordion from 'react-bootstrap/Accordion';

interface Props {
  links: {
    link: string;
    name: string;
    children?: {
      link: string;
      name: string;
    }[];
  }[];
}

const Sidebar = ({ links }: Props) => {
  const { pathname } = useLocation();
  const { t } = useI18n();
  const [expandedGrouping, setExpandedGrouping] = useState<string | null>(null);

  return (
    <div className="left-sidebar sticky">
      <ul className="sidebar-list">
        {links.map(link =>
          link.children ? (
            <Accordion key={link.link}>
              <Accordion.Toggle
                eventKey={link.name}
                as="li"
                onClick={() =>
                  setExpandedGrouping(
                    expandedGrouping === link.name ? null : link.name,
                  )
                }
                className={clsx(
                  'd-flex sidebar-list__item',
                  link.name === expandedGrouping && 'show',
                )}
              >
                {t(link.name)}
                <i className="icon-down1 ml-auto sidebar-list__item-icon"></i>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={link.name}>
                {link.children && (
                  <ul className="sidebar-list__sub">
                    {link.children.map(childLink => (
                      <li
                        key={childLink.link}
                        className={clsx(
                          `sidebar-list__sub-item`,
                          childLink.link === pathname ? 'active' : 'inactive',
                        )}
                      >
                        <Link
                          to={childLink.link}
                          className="sidebar-list__sub-item-link"
                        >
                          {t(childLink.name)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Accordion.Collapse>
            </Accordion>
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
          ),
        )}
      </ul>
    </div>
  );
};
export default Sidebar;
