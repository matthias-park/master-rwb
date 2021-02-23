import React, { useState, useRef, useEffect, useMemo } from 'react';
import HeaderLink from '../../types/HeaderLinks';
import { Dropdown } from 'react-bootstrap';
import { sortAscending } from '../../utils/index';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useI18n } from '../../hooks/useI18n';
import { useConfig } from '../../hooks/useConfig';
import useOnClickOutside from '../../hooks/useOnClickOutside';

interface HeaderNavLinkProps {
  data: HeaderLink;
  mobile: boolean;
  handleNavChange: (
    externalLink: boolean | undefined,
    ref: HTMLElement | null,
  ) => void;
  active: HTMLElement | null;
  setActive: (value: HTMLElement | null) => void;
  fullPath: string;
}

// export const HeaderNavCardLink = ({ data, mobile }: HeaderNavLinkProps) => {
//   if (!mobile && data.mobileLink) {
//     return null;
//   }
//   return (
//     <Dropdown as="li" className="header__nav-item dropdown dropdown--wide">
//       <Dropdown.Toggle
//         as="div"
//         title={`${data.name} ▼`}
//         className="header__nav-item-link cursor-pointer"
//       >
//         {data.name}
//       </Dropdown.Toggle>
//       <Dropdown.Menu
//         className="drawgames"
//         aria-labelledby="navbarDropdownMenuLink"
//       >
//         {data
//           .cards!.sort((a, b) => sortAscending(a.order, b.order))
//           .map(card => {
//             const smallCard = !card.text && !card.smallText;
//             const cardLinkProps = card.path
//               ? { as: Link, to: card.path! }
//               : { as: 'div' };
//             return (
//               // @ts-ignore
//               <Dropdown.Item
//                 key={`${card.path}-${card.logo}`}
//                 className={clsx(
//                   smallCard ? 'drawgames__game' : 'drawgames-card',
//                   card.color &&
//                     `drawgames${smallCard ? '__game' : '-card'}--${card.color}`,
//                 )}
//                 {...cardLinkProps}
//               >
//                 <img
//                   className={
//                     smallCard ? 'drawgames__game-img' : 'drawgames-card__img'
//                   }
//                   src={card.logo}
//                   alt="card logo"
//                 />
//                 {!smallCard && (
//                   <>
//                     <div className="d-flex justify-content-end">
//                       <div className="drawgames-card__text ml-auto">
//                         {card.smallText && (
//                           <small
//                             className={clsx(
//                               'drawgames-card__text-small',
//                               card.smallTextIcon &&
//                                 'drawgames-card__text-small--icon',
//                             )}
//                           >
//                             {card.smallText}
//                           </small>
//                         )}
//                         {card.text}
//                       </div>
//                     </div>
//                     {card.button1 && (
//                       <Link
//                         to={card.button1.path}
//                         className="drawgames-card__link"
//                       >
//                         {card.button1.name}
//                       </Link>
//                     )}
//                     {card.button2 && (
//                       <>
//                         {' '}
//                         <Link
//                           to={card.button2.path}
//                           className="drawgames-card__link"
//                         >
//                           {card.button2.name}
//                         </Link>
//                       </>
//                     )}
//                   </>
//                 )}
//               </Dropdown.Item>
//             );
//           })}
//       </Dropdown.Menu>
//     </Dropdown>
//   );
// };

export const HeaderNavClassicLink = ({
  data,
  mobile,
  handleNavChange,
  active,
  setActive,
  fullPath,
}: HeaderNavLinkProps) => {
  const { t } = useI18n();
  const { locale, user } = useConfig();
  const dropdownRef = useRef(null);
  useOnClickOutside(dropdownRef, () => setActive(mobile ? active : null));
  const dropdownLinks = useMemo(
    () => data.links?.sort((a, b) => sortAscending(a.order, b.order)),
    [data],
  );

  const showDropdown =
    !!(data.path || data.prefix) &&
    fullPath.startsWith(data.path || data.prefix || '') &&
    !active &&
    !mobile;

  // useEffect(() => {
  //   if (showDropdown) {
  //     contentStyle.set({ marginTop: '45px' });
  //   }
  // }, [showDropdown]);
  if (!mobile && data.mobileLink) {
    return null;
  }

  return (
    <Dropdown
      ref={ref => {
        if (data.externalLink || mobile) dropdownRef.current = ref;
      }}
      as="li"
      className="header__nav-item"
      show={
        (data.externalLink || mobile) && active === dropdownRef.current
          ? true
          : showDropdown
      }
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
            handleNavChange(data.externalLink, dropdownRef.current);
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
            >
              <span>{t(data.name)}</span>
            </Link>
          )}
          <Dropdown.Toggle
            as={'i'}
            className="header__nav-item-icon icon-down"
            onClick={() => {
              handleNavChange(data.externalLink, dropdownRef.current);
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
                link.path.includes('https') || link.path.includes('#')
                  ? 'a'
                  : (props: any): any => <Link to={link.path} {...props} />
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
