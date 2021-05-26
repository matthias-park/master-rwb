import React from 'react';
import Link from '../components/Link';
import parse, { domToReact, HTMLReactParserOptions } from 'html-react-parser';

export const replaceStringTagsReact = (text: string, props: any = {}) => {
  const htmlParseOptions: HTMLReactParserOptions = {
    replace: (domNode: any) => {
      if (
        domNode.type === 'tag' &&
        domNode.name === 'a' &&
        domNode.attribs?.href &&
        domNode.attribs.href.startsWith('/')
      ) {
        const { href, ...attribs } = domNode.attribs;
        return (
          <Link to={href} {...attribs} {...props}>
            {domToReact(domNode.children, htmlParseOptions)}
          </Link>
        );
      }
    },
  };
  return parse(text, htmlParseOptions);
};
