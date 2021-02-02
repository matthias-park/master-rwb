import React, { useEffect } from 'react';
import HeaderLink from '../../types/HeaderLinks';
import { Dropdown } from 'react-bootstrap';
import { sortAscending } from '../../utils/index';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useI18n } from '../../hooks/useI18n';
import { useUIConfig } from '../../hooks/useUIConfig';

interface HeaderNavLinkProps {
  data: HeaderLink;
  mobile: boolean;
}

export const HeaderNavCardLink = ({ data, mobile }: HeaderNavLinkProps) => {
  if (!mobile && data.mobileLink) {
    return null;
  }
  return (
    <Dropdown as="li" className="header__nav-item dropdown dropdown--wide">
      <Dropdown.Toggle
        as="div"
        title={`${data.name} ▼`}
        className="header__nav-item-link cursor-pointer"
      >
        {data.name}
      </Dropdown.Toggle>
      <Dropdown.Menu
        className="drawgames"
        aria-labelledby="navbarDropdownMenuLink"
      >
        {data
          .cards!.sort((a, b) => sortAscending(a.order, b.order))
          .map(card => {
            const smallCard = !card.text && !card.smallText;
            const cardLinkProps = card.path
              ? { as: Link, to: card.path! }
              : { as: 'div' };
            return (
              // @ts-ignore
              <Dropdown.Item
                key={`${card.path}-${card.logo}`}
                className={clsx(
                  smallCard ? 'drawgames__game' : 'drawgames-card',
                  card.color &&
                    `drawgames${smallCard ? '__game' : '-card'}--${card.color}`,
                )}
                {...cardLinkProps}
              >
                <img
                  className={
                    smallCard ? 'drawgames__game-img' : 'drawgames-card__img'
                  }
                  src={card.logo}
                  alt="card logo"
                />
                {!smallCard && (
                  <>
                    <div className="d-flex justify-content-end">
                      <div className="drawgames-card__text ml-auto">
                        {card.smallText && (
                          <small
                            className={clsx(
                              'drawgames-card__text-small',
                              card.smallTextIcon &&
                                'drawgames-card__text-small--icon',
                            )}
                          >
                            {card.smallText}
                          </small>
                        )}
                        {card.text}
                      </div>
                    </div>
                    {card.button1 && (
                      <Link
                        to={card.button1.path}
                        className="drawgames-card__link"
                      >
                        {card.button1.name}
                      </Link>
                    )}
                    {card.button2 && (
                      <>
                        {' '}
                        <Link
                          to={card.button2.path}
                          className="drawgames-card__link"
                        >
                          {card.button2.name}
                        </Link>
                      </>
                    )}
                  </>
                )}
              </Dropdown.Item>
            );
          })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export const HeaderNavClassicLink = ({ data, mobile }: HeaderNavLinkProps) => {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const { contentStyle } = useUIConfig();
  useEffect(() => {
    if (data.path === pathname) {
      contentStyle.set({ marginTop: '45px' });
    }
  }, [pathname]);
  if (!mobile && data.mobileLink) {
    return null;
  }
  if (data.links) {
    return (
      <Dropdown
        as="li"
        className="header__nav-item"
        show={pathname === data.path}
      >
        <Dropdown.Toggle
          as={Link}
          to={data.path || '/'}
          title={`${data.name} ▼}`}
          className="header__nav-item-link cursor-pointer"
        >
          {t(data.name) || data.name}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {data.links
            .sort((a, b) => sortAscending(a.order, b.order))
            .map(link => (
              <Dropdown.Item key={link.path} as={Link} to={link.path}>
                {link.text}
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
  return (
    <li className="header__nav-item">
      <Link className="header__nav-item-link" to={data.path!}>
        {data.name}
        {data.externalLink && (
          <i className="icon-redirect header__nav-item-icon" />
        )}
      </Link>
    </li>
  );
};
