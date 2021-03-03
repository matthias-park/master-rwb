import clsx from 'clsx';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { AvailableLocale } from '../../types/api/PageConfig';

interface Props {
  available: AvailableLocale[];
  current: string;
  setLocale: (locale: string) => void;
}

const LocaleSelector = ({ available, current, setLocale }: Props) => (
  <>
    <Dropdown className="header__nav-item">
      <Dropdown.Toggle
        data-testid="dropdown-trigger"
        variant="link"
        className="header__nav-item-link d-none d-xl-block"
        id="navbarDropdownMenuLink"
      >
        <strong data-testid="current" className="text-uppercase">
          {current}
        </strong>
      </Dropdown.Toggle>
      <Dropdown.Menu data-testid="available-desktop">
        {available.map(lang => (
          <Dropdown.Item
            data-testid={`desktop-locale-${lang.iso}`}
            className={`lang-${lang.iso} header__nav-item-link text-uppercase cursor-pointer`}
            key={lang.id}
            as="div"
            onClick={() => {
              setLocale(lang.iso);
            }}
          >
            {lang.iso}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
    <li className="d-flex d-xl-none languages" data-testid="available-mobile">
      {available.map(lang => (
        <div
          className={clsx(
            `lang-${lang.iso}`,
            'header__nav-item-link text-uppercase cursor-pointer',
            lang.iso === current && 'font-weight-bold',
          )}
          key={lang.id}
          onClick={() => {
            setLocale(lang.iso);
          }}
        >
          {lang.iso}
        </div>
      ))}
    </li>
  </>
);

export default LocaleSelector;
