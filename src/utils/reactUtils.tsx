import React from 'react';
import Link from '../components/Link';

const regexToReact = [
  {
    regex: /{linkTo=([^\s]+)([ newTab]+)?}(.*?){linkTo}/gm,
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
  {
    regex: /<br\/>/gm,
    component: () => <br />,
  },
  {
    regex: /<(small|p|b|strong|em|i|kbd|mark|q|s|samp|sub|var)>(.*?)<\/(small|p|b|strong|em|i|kbd|mark|q|s|samp|sub|var)>/gm,
    component: matches => {
      const [, Tag, text] = matches;
      return <Tag>{text}</Tag>;
    },
  },
];

const findReplaceComponent = (
  textArr: (string | JSX.Element)[],
  component,
  props,
) => {
  for (const textIndex in textArr) {
    let text = textArr[textIndex];
    if (typeof text !== 'string') continue;
    let result: RegExpExecArray | null = null;
    const temp: (string | JSX.Element)[] = [];
    do {
      component.regex.lastIndex = 0;
      result = component.regex.exec(text);
      if (result) {
        let index = result.index;
        let match = result[0];
        temp.push(text.substring(0, index));
        temp.push(component.component(result, props));
        text = text.substring(index + match.length, text.length + 1);
      }
    } while (result);
    if (text.length) temp.push(text);
    textArr.splice(Number(textIndex), 1, ...temp);
  }
  return textArr;
};

export const replaceStringTagsReact = (text: string, props: any = {}) => {
  if (!regexToReact.some(regex => regex.regex.test(text))) return text;
  let output: (string | JSX.Element)[] = [text];
  for (const regex of regexToReact) {
    output = findReplaceComponent(output, regex, props);
  }
  return output;
};
