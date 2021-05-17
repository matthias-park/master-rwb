import React from 'react';
import Link from '../components/Link';

const regexToReact = [
  {
    regex: /{linkTo=([^\s]+)([ newTab]+)?}(.*){linkTo}/gm,
    component: (matches, props) => {
      const url = matches[1] as string;
      const newTab = !!matches[2];
      const name = matches[3];
      if (newTab) {
        const locale = window.location.pathname.split('/')[1];
        return (
          <a
            {...props}
            target="_blank"
            rel="noreferrer"
            href={`${window.location.origin}/${locale}${
              url.startsWith('/') ? '' : '/'
            }${url}`}
          >
            {name}
          </a>
        );
      }
      return (
        <Link {...props} to={url}>
          {name}
        </Link>
      );
    },
  },
];

export const replaceStringTagsReact = (text: string, props: any = {}) => {
  if (!regexToReact.some(regex => regex.regex.test(text))) return text;
  let result: RegExpExecArray | null = null;
  const output: (string | JSX.Element)[] = [];
  for (const regex of regexToReact) {
    regex.regex.lastIndex = 0;
    while ((result = regex.regex.exec(text)) !== null) {
      let index = result.index;
      let match = result[0];
      output.push(text.substring(0, index));
      output.push(regex.component(result, props));
      text = text.substring(index + match.length, text.length + 1);
    }
  }

  return output;
};
