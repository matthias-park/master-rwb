/* eslint-disable jsx-a11y/iframe-has-title */
import React, {
  IframeHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react';
import LoadingSpinner from '../LoadingSpinner';
import clsx from 'clsx';
import { convertStylesStringToObject } from '../../utils/reactUtils';
import { Franchise } from '../../constants';

const IframeObject = (props: IframeHTMLAttributes<HTMLIFrameElement>) => {
  const ref = useRef<HTMLIFrameElement | null>(null);
  const isPdf = props.src?.endsWith('.pdf');
  const iframeTimeoutId = useRef(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const showPdfViewer = !Franchise.bnl && isPdf && props.src;
  const src = showPdfViewer
    ? `https://docs.google.com/gview?url=${props.src}&embedded=true`
    : props.src;

  const updateIframeSrc = () => {
    if (ref.current && src) {
      ref.current.src = src;
    }
  };

  useEffect(() => {
    if (showPdfViewer) {
      iframeTimeoutId.current = setInterval(updateIframeSrc, 1000 * 3);
    }
  }, []);

  const onLoad = () => {
    clearInterval(iframeTimeoutId.current);
    setIframeLoaded(true);
  };
  const stylesObject = props.style && convertStylesStringToObject(props.style);

  return (
    <>
      {!iframeLoaded && (
        <div
          style={{ height: props.height }}
          className={clsx('d-flex justify-content-center mx-auto')}
        >
          <LoadingSpinner show className="mx-auto mt-5" />
        </div>
      )}
      <iframe
        key={props.src}
        ref={ref}
        onLoad={onLoad}
        {...props}
        src={src}
        style={iframeLoaded ? stylesObject : { display: 'none' }}
      />
    </>
  );
};

export default IframeObject;
