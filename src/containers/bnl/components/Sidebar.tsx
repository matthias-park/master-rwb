import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useI18n } from '../../../hooks/useI18n';
import Link from '../../../components/Link';
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
  const [expandedGrouping, setExpandedGrouping] = useState('');

  useEffect(() => {
    const pathGroup = links.find(
      link =>
        link.children?.length &&
        link.children?.some(child => pathname.includes(child.link)),
    );
    pathGroup && setExpandedGrouping(pathGroup?.name);
  }, [pathname]);

  return (
    <div className="left-sidebar sticky">
      <ul className="sidebar-list">
        <Accordion activeKey={expandedGrouping}>
          {links.map(link =>
            link.children ? (
              <>
                <Accordion.Toggle
                  key={link.link}
                  eventKey={link.name}
                  as="li"
                  onClick={() =>
                    setExpandedGrouping(
                      expandedGrouping === link.name ? '' : link.name,
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
              </>
            ) : (
              <Link key={link.link} to={link.link}>
                <li
                  className={clsx(
                    `sidebar-list__item`,
                    link.link === pathname ? 'active' : 'inactive',
                  )}
                >
                  <span className="sidebar-list__item-link">
                    {t(link.name)}
                  </span>
                </li>
              </Link>
            ),
          )}
        </Accordion>
      </ul>
    </div>
  );
};
export default Sidebar;
