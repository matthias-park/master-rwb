import clsx from 'clsx';
import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { AvailableLocale } from '../../../../types/api/PageConfig';
import LoadingSpinner from '../../../../components/LoadingSpinner';

interface Props {
  available: AvailableLocale[];
  current: string;
  setLocale: (locale: string) => Promise<void>;
}

const LocaleSelector = ({ available, current, setLocale }: Props) => {
  const [updatingLocale, setUpdatingLocale] = useState('');
  const changeLocale = async (lang: string) => {
    if (!!updatingLocale) return;
    setUpdatingLocale(lang);
    await setLocale(lang);
    setUpdatingLocale('');
  };
  return (
    <>
      <Dropdown className="header__nav-item">
        <Dropdown.Toggle
          data-testid="dropdown-trigger"
          variant="link"
          className="header__nav-item-link d-none d-xl-block"
          id="navbarDropdownMenuLink"
          disabled={!!updatingLocale}
        >
          <LoadingSpinner show={!!updatingLocale} className="mr-1" />
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
                changeLocale(lang.iso);
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
              ((lang.iso === current && !updatingLocale) ||
                lang.iso === updatingLocale) &&
                'font-weight-bold',
            )}
            key={lang.id}
            onClick={() => {
              changeLocale(lang.iso);
            }}
          >
            <LoadingSpinner
              show={updatingLocale === lang.iso}
              small
              className="mr-1"
            />
            {lang.iso}
          </div>
        ))}
      </li>
    </>
  );
};

export default LocaleSelector;
