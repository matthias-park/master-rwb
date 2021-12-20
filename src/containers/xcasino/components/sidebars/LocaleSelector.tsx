import React from 'react';
import LeftSidebarMenu from './LeftSidebarMenu';
import { useConfig } from '../../../../hooks/useConfig';
import { useDispatch } from 'react-redux';
import { setLocale } from '../../../../state/reducers/config';

interface LocaleSelectorProps {
  goBack: () => void;
}

const LocaleSelector = ({ goBack }: LocaleSelectorProps) => {
  const dispatch = useDispatch();
  const { locales, locale } = useConfig();

  const changeLocale = async (lang: string) => {
    if (lang === locale) return;
    dispatch(setLocale(lang));
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
