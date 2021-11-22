import React, { useRef, useMemo, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { sortAscending } from '../../../../utils/index';
import clsx from 'clsx';
import { useI18n } from '../../../../hooks/useI18n';
import { useConfig } from '../../../../hooks/useConfig';
import { useUIConfig } from '../../../../hooks/useUIConfig';
import { HeaderRoute } from '../../../../types/api/PageConfig';
import useGTM from '../../../../hooks/useGTM';
import Link from '../../../../components/Link';
import { matchPath, useLocation } from 'react-router';
import useDesktopWidth from '../../../../hooks/useDesktopWidth';
import { useAuth } from '../../../../hooks/useAuth';
import useHover from '../../../../hooks/useHover';
import { StyledHeaderNavItem } from '../styled/StyledHeader';

interface HeaderNavLinkProps {
  data: HeaderRoute;
  mobile: boolean;
  active: string | null;
  setNavExpanded: (value: boolean) => void;
  toggleActive: (name?: string | null, active?: boolean) => void;
}

export const HeaderNavClassicLink = ({
  data,
  mobile,
  active,
  setNavExpanded,
  toggleActive,
}: HeaderNavLinkProps) => {
  const { t } = useI18n();
  const { routes } = useConfig(
    (prev, next) => prev.routes.length === next.routes.length,
  );
  const { user } = useAuth();
  const { pathname, hash } = useLocation();
  const fullPath = routes.find(route => {
    const match = (path: string) =>
      matchPath(path, {
        path: route.path,
        exact: route.exact ?? true,
      });
    return match(`${pathname}${hash}`) || match(pathname);
  })?.path;
  const { backdrop } = useUIConfig();
  const desktopWidth = useDesktopWidth(1199);
  const dropdownRef = useRef(null);
  const sendDataToGTM = useGTM();
  const hover = useHover(dropdownRef, desktopWidth);
  const dropdownLinks = useMemo(
    () => data.links?.concat().sort((a, b) => sortAscending(a.order, b.order)),
    [data.links],
  );
  const currentLinkActive = active?.includes(
    `${!desktopWidth ? 'hover:' : ''}${data.name}`,
  );

  useEffect(() => {
    let timer: number | undefined;
    if (desktopWidth) {
      timer = setTimeout(
        () => toggleActive(`hover:${data.name}`, hover),
        hover ? 600 : 800,
      );
    }

    return () => {
      clearTimeout(timer);
    };
  }, [hover]);

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
      as={StyledHeaderNavItem}
      className="nav-item"
      show={currentLinkActive}
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
          className="nav-link cursor-pointer"
          onClick={() => {
            toggleActive(`hover:${data.name}`, !currentLinkActive);
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
            toggleActive(`hover:${data.name}`, !currentLinkActive);
          }}
        >
          <span className="nav-link cursor-pointer">
            <span>{t(data.name)}</span>
            {data.externalLink && <i className="icon-redirect"></i>}
          </span>
          <i className="nav-icon icon-down"></i>
        </Dropdown.Toggle>
      )}
      <Dropdown.Menu>
        {dropdownLinks?.map(link => {
          if (link.onlyLoggedIn && !user.logged_in) return null;
          const path = link.path || t(link.translationPath!);
          return (
            <Dropdown.Item
              key={path}
              as={
                path.includes('https')
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
              {...(path.includes('https')
                ? {
                    rel: 'noopener',
                    target: '_blank',
                  }
                : {})}
              className={clsx(
                (link.path === fullPath ||
                  link.path === `${pathname}${hash}`) &&
                  'active',
              )}
              href={path}
            >
              {t(link.text)}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};
