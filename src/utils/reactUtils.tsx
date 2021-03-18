import React from 'react';
import Link from '../components/Link';

const regexToReact = [
  {
    regex: /{linkTo=(.*)}(.*){linkTo}/gm,
    component: matches => <Link to={matches[1]}>{matches[2]}</Link>,
  },
];

export const replaceStringTagsReact = (text: string) => {
  if (!regexToReact.some(regex => regex.regex.test(text))) return text;
  let result: RegExpExecArray | null = null;
  const output: (string | JSX.Element)[] = [];
  for (const regex of regexToReact) {
    regex.regex.lastIndex = 0;
    while ((result = regex.regex.exec(text)) !== null) {
      let index = result.index;
      let match = result[0];
      output.push(text.substring(0, index));
      output.push(regex.component(result));
      text = text.substring(index + match.length, text.length + 1);
    }
  }

  return output;
};
