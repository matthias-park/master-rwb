import React from 'react';
import Link from '../components/Link';
import parse, {
  domToReact,
  HTMLReactParserOptions,
  attributesToProps,
} from 'html-react-parser';
import loadable from '@loadable/component';

const LoadableIframe = loadable(
  () => import('../components/ComponentFromString/Iframe'),
);

export const convertStylesStringToObject = stringStyles =>
  typeof stringStyles === 'string'
    ? stringStyles.split(';').reduce((acc, style) => {
        const colonPosition = style.indexOf(':');

        if (colonPosition === -1) {
          return acc;
        }

        const camelCaseProperty = style
            .substr(0, colonPosition)
            .trim()
            .replace(/^-ms-/, 'ms-')
            .replace(/-./g, c => c.substr(1).toUpperCase()),
          value = style.substr(colonPosition + 1).trim();

        return value ? { ...acc, [camelCaseProperty]: value } : acc;
      }, {})
    : {};

export const replaceStringTagsReact = (text: string, props: any = {}) => {
  const htmlParseOptions: HTMLReactParserOptions = {
    replace: (domNode: any) => {
      const isAnchorTag =
        (domNode.type === 'tag' && domNode.name === 'a') ||
        (domNode.type === 'text' && domNode.parent?.name === 'a');
      if (isAnchorTag && domNode.attribs?.href) {
        const { href, style, ...attribs } = domNode.attribs;
        const stylesObject = style && convertStylesStringToObject(style);
        const to = href.includes('https')
          ? href
          : href.replace('http', 'https');
        return (
          <Link
            to={to}
            className="translation-link"
            style={stylesObject ? stylesObject : undefined}
            {...attribs}
            {...props}
          >
            {domToReact(domNode.children, htmlParseOptions)}
          </Link>
        );
      } else if (domNode.type === 'script') {
        return (
          <script
            {...domNode.attribs}
            ref={ref => {
              if (ref && !ref.innerHTML.length) {
                const script = document.createElement('script');
                const scriptProps = attributesToProps(domNode.attribs);
                Object.keys(scriptProps).forEach(key => {
                  script[key] = scriptProps[key];
                });
                script.innerHTML = domToReact(
                  domNode.children,
                  htmlParseOptions,
                ) as string;
                const scriptParent = ref.parentNode;
                if (scriptParent) {
                  scriptParent.removeChild(ref);
                  scriptParent.appendChild(script);
                }
              }
            }}
          />
        );
      } else if (domNode.type === 'tag' && domNode.name === 'iframe') {
        return <LoadableIframe {...domNode.attribs} />;
      }
    },
  };
  return parse(text, htmlParseOptions);
};
