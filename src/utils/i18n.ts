type Symbols = { [key: string]: { [key: string]: string } };

const i18n = () => {
  let locale = '';
  const symbols: Symbols = {};

  return {
    set(lang: string, data: unknown = {}) {
      symbols[lang] = Object.assign(symbols[lang] || {}, data);
    },

    locale(lang?: string) {
      return (locale = lang || locale);
    },

    table(lang: string) {
      return symbols[lang];
    },

    t(key: string, lang?: string) {
      const val = symbols?.[lang || locale]?.[key] || '';
      return val;
    },
  };
};
export type I18n = ReturnType<typeof i18n>;
export default i18n;
