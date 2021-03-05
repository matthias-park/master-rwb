import React, { useRef, useMemo } from 'react';
import { Dropdown } from 'react-bootstrap';
import { sortAscending } from '../../utils/index';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useI18n } from '../../hooks/useI18n';
import { useConfig } from '../../hooks/useConfig';
import { useUIConfig } from '../../hooks/useUIConfig';
import { HeaderRoute } from '../../types/api/PageConfig';

interface HeaderNavLinkProps {
  data: HeaderRoute;
  mobile: boolean;
  handleNavChange: (ref: HTMLElement | null) => void;
  active: HTMLElement | null;
  setNavExpanded: (value: boolean) => void;
  fullPath: string;
}

export const HeaderNavClassicLink = ({
  data,
  mobile,
  handleNavChange,
  active,
  setNavExpanded,
  fullPath,
}: HeaderNavLinkProps) => {
  const { t } = useI18n();
  const { locale, user } = useConfig();
  const { backdrop } = useUIConfig();
  const dropdownRef = useRef(null);
  const dropdownLinks = useMemo(
    () => data.links?.sort((a, b) => sortAscending(a.order, b.order)),
    [data.links],
  );

  const showDropdown =
    !!data.prefix &&
    fullPath.startsWith(data.prefix || '') &&
    !active &&
    !mobile;

  return (
    <Dropdown
      ref={dropdownRef}
      as="li"
      className="header__nav-item"
      show={(!active && showDropdown) || active === dropdownRef.current}
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
            handleNavChange(dropdownRef.current);
          }}
        >
          {t(data.name)}
        </Dropdown.Toggle>
      ) : (
        <div className="d-flex align-items-center w-100">
          {data.externalLink ? (
            <span className="header__nav-item-link cursor-pointer">
              <span>{t(data.name)}</span>
            </span>
          ) : (
            <Link
              to={dropdownLinks?.[0].path || '/'}
              className="header__nav-item-link cursor-pointer"
              onClick={() => {
                setNavExpanded(false);
                backdrop.hide();
              }}
            >
              <span>{t(data.name)}</span>
            </Link>
          )}
          <Dropdown.Toggle
            as={'i'}
            className="header__nav-item-icon icon-down"
            onClick={() => {
              handleNavChange(dropdownRef.current);
            }}
          ></Dropdown.Toggle>
        </div>
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
