import React, { useRef, useMemo } from 'react';
import { Dropdown } from 'react-bootstrap';
import { sortAscending } from '../../utils/index';
import clsx from 'clsx';
import { useI18n } from '../../hooks/useI18n';
import { useConfig } from '../../hooks/useConfig';
import { useUIConfig } from '../../hooks/useUIConfig';
import { HeaderRoute } from '../../types/api/PageConfig';
import useGTM from '../../hooks/useGTM';
import Link from '../Link';
import { useLocation } from 'react-router';
import useDesktopWidth from '../../hooks/useDesktopWidth';
import { useAuth } from '../../hooks/useAuth';

interface HeaderNavLinkProps {
  data: HeaderRoute;
  mobile: boolean;
  active: string | null;
  setNavExpanded: (value: boolean) => void;
  toggleActive: (name?: string | null) => void;
}

export const HeaderNavClassicLink = ({
  data,
  mobile,
  active,
  setNavExpanded,
  toggleActive,
}: HeaderNavLinkProps) => {
  const { t } = useI18n();
  const { locale } = useConfig((prev, next) => prev.locale === next.locale);
  const { user } = useAuth();
  const { pathname, hash } = useLocation();
  const fullPath = /^\/sports#bethistory\/[\d]{4}(-[\d]{2}){2}$/i.test(
    `${pathname}${hash}`,
  )
    ? '/sports#bethistory'
    : `${pathname}${hash}`;
  const { backdrop } = useUIConfig();
  const desktopWidth = useDesktopWidth(1199);
  const dropdownRef = useRef(null);
  const sendDataToGTM = useGTM();
  const dropdownLinks = useMemo(
    () => data.links?.sort((a, b) => sortAscending(a.order, b.order)),
    [data.links],
  );

  const onGtmLinkClick = (name: string, subHeader: boolean = false) => {
    sendDataToGTM({
      event: mobile
        ? 'BurgerMenuClick'
        : `${subHeader ? 'Sub' : ''}MainNavigationClick`,
      'tglab.ItemClicked': t(name),
    });
  };

  return (
    <Dropdown
      ref={dropdownRef}
      as="li"
      className="header__nav-item"
      show={active?.includes(`${mobile ? 'hover:' : ''}${data.name}`)}
      onMouseEnter={() => desktopWidth && toggleActive(data.name)}
      onMouseLeave={() => desktopWidth && toggleActive(null)}
    >
      {!mobile ? (
        <Dropdown.Toggle
          as={
            data.externalLink
              ? 'div'
              : React.forwardRef((props: any, ref): any => (
                  <Link
                    ref={ref}
                    to={dropdownLinks?.[0].path || '/'}
                    {...props}
                  />
                ))
          }
          className="header__nav-item-link cursor-pointer"
          onClick={() => {
            toggleActive(data.name);
          }}
        >
          {t(data.name)}
          {data.externalLink && <i className="icon-redirect"></i>}
        </Dropdown.Toggle>
      ) : (
        <Dropdown.Toggle
          as="div"
          className="d-flex align-items-center w-100 cursor-pointer"
          onClick={() => {
            toggleActive(data.name);
          }}
        >
          <span className="header__nav-item-link cursor-pointer">
            <span>{t(data.name)}</span>
            {data.externalLink && <i className="icon-redirect"></i>}
          </span>
          <i className="header__nav-item-icon icon-down"></i>
        </Dropdown.Toggle>
      )}
      <Dropdown.Menu>
        {dropdownLinks?.map(link => {
          if (link.onlyLoggedIn && !user.logged_in) return null;
          return (
            <Dropdown.Item
              key={link.path}
              as={
                link.path.includes('https')
                  ? 'a'
                  : (props: any): any => (
                      <Link
                        to={link.path}
                        {...props}
                        onClick={() => {
                          onGtmLinkClick(link.text, true);
                          setNavExpanded(false);
                          backdrop.hide();
                        }}
                      />
                    )
              }
              {...(link.path.includes('https')
                ? {
                    rel: 'noopener',
                    target: '_blank',
                  }
                : {})}
              className={clsx(link.path === fullPath && 'active')}
              href={link.path.replace('{__locale__}', locale)}
            >
              {t(link.text)}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};
