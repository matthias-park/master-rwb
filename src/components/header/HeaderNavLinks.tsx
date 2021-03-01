import React, { useRef, useMemo } from 'react';
import HeaderLink from '../../types/HeaderLinks';
import { Dropdown } from 'react-bootstrap';
import { sortAscending } from '../../utils/index';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useI18n } from '../../hooks/useI18n';
import { useConfig } from '../../hooks/useConfig';
import { useUIConfig } from '../../hooks/useUIConfig';

interface HeaderNavLinkProps {
  data: HeaderLink;
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
    !!(data.path || data.prefix) &&
    fullPath.startsWith(data.path || data.prefix || '') &&
    !active &&
    !mobile;

  if (!mobile && data.mobileLink) {
    return null;
  }

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
              : (props: any): any => (
                  <Link
                    to={data.path || dropdownLinks?.[0].path || '/'}
                    {...props}
                  />
                )
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
              to={data.path || dropdownLinks?.[0].path || '/'}
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
              target={link.path.includes('https') ? '_blank' : undefined}
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
