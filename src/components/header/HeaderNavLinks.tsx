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

interface HeaderNavLinkProps {
  data: HeaderRoute;
  mobile: boolean;
  handleNavChange: (id: string) => void;
  active: string | null;
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
  const { locale, user } = useConfig((prev, next) => {
    const localeEqual = prev.locale === next.locale;
    const userEqual = prev.user.logged_in === next.user.logged_in;
    return localeEqual && userEqual;
  });
  const { backdrop } = useUIConfig();
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
      show={(!active && showDropdown) || active === (data.prefix || data.name)}
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
            handleNavChange(data.prefix || data.name);
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
                onGtmLinkClick(data.name);
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
              handleNavChange(data.prefix || data.name);
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
