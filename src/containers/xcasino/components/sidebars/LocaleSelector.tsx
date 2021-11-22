import React, { useState } from 'react';
import LeftSidebarMenu from './LeftSidebarMenu';
import { useConfig } from '../../../../hooks/useConfig';

interface LocaleSelectorProps {
  goBack: () => void;
}

const LocaleSelector = ({ goBack }: LocaleSelectorProps) => {
  const [updatingLocale, setUpdatingLocale] = useState('');
  const { locales, locale } = useConfig();

  const changeLocale = async (lang: string) => {
    /*if (!!updatingLocale || lang === locale) return;
    setUpdatingLocale(lang);
    await setLocale(lang);
    setUpdatingLocale('');*/
  };

  return (
    <LeftSidebarMenu
      goBack={goBack}
      items={locales.map(locale => ({
        title: locale.iso,
        onClick: () => changeLocale(locale.iso),
      }))}
    />
  );
};

export default LocaleSelector;
