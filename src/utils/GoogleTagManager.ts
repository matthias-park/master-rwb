import {
  IDataLayer,
  ISnippets,
  ISendToGTM,
  ISetupGTM,
  ISnippetsParams,
} from '../types/GoogleTagManager';

const getDataLayerSnippet = (
  dataLayer: Pick<IDataLayer, 'dataLayer'>['dataLayer'],
  dataLayerName: Pick<
    IDataLayer,
    'dataLayerName'
  >['dataLayerName'] = 'dataLayer',
): Pick<ISnippets, 'gtmDataLayer'>['gtmDataLayer'] =>
  `window.${dataLayerName} = window.${dataLayerName} || []; window.${dataLayerName}.push(${JSON.stringify(
    dataLayer,
  )})`;

const getIframeSnippet = (
  id: Pick<ISnippetsParams, 'id'>['id'],
  environment?: Pick<ISnippetsParams, 'environment'>['environment'],
) => {
  let params = ``;
  if (environment) {
    const { gtm_auth, gtm_preview } = environment;
    params = `&gtm_auth=${gtm_auth}&gtm_preview=${gtm_preview}&gtm_cookies_win=x`;
  }
  return `<iframe src="https://www.googletagmanager.com/ns.html?id=${id}${params}" height="0" width="0" style="display:none;visibility:hidden" id="tag-manager"></iframe>`;
};

const getGTMScript = (
  dataLayerName: Pick<ISnippetsParams, 'dataLayerName'>['dataLayerName'],
  id: Pick<ISnippetsParams, 'id'>['id'],
  environment?: Pick<ISnippetsParams, 'environment'>['environment'],
) => {
  let params = ``;
  if (environment) {
    const { gtm_auth, gtm_preview } = environment;
    params = `+"&gtm_auth=${gtm_auth}&gtm_preview=${gtm_preview}&gtm_cookies_win=x"`;
  }
  return `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl${params};f.parentNode.insertBefore(j,f);
      })(window,document,'script','${dataLayerName}','${id}');
    `;
};
/**
 * Function to setup the Google Tag Manager
 * @param params - The snippets params
 */
const setupGTM = (params: ISnippetsParams): ISetupGTM => {
  const getDataLayerScript = (): HTMLElement => {
    const dataLayerScript = document.createElement('script');
    dataLayerScript.innerHTML = getDataLayerSnippet(
      params.dataLayer,
      params.dataLayerName,
    );
    return dataLayerScript;
  };

  const getNoScript = (): HTMLElement => {
    const noScript = document.createElement('noscript');
    noScript.innerHTML = getIframeSnippet(params.id, params.environment);
    return noScript;
  };

  const getScript = (): HTMLElement => {
    const script = document.createElement('script');
    script.innerHTML = getGTMScript(
      params.dataLayerName,
      params.id,
      params.environment,
    );
    return script;
  };

  return {
    getDataLayerScript,
    getNoScript,
    getScript,
  };
};

/**
 * Function to init the GTM
 * @param dataLayer - The dataLayer
 * @param dataLayerName - The dataLayer name
 * @param environment - Specify the custom environment to use
 * @param id - The ID of the GTM
 */
export const initGTM = ({
  dataLayer,
  dataLayerName,
  environment,
  id,
}: ISnippetsParams): void => {
  const gtm = setupGTM({
    dataLayer,
    dataLayerName,
    environment,
    id,
  });

  const dataLayerScript = gtm.getDataLayerScript();
  const script = gtm.getScript();
  const noScript = gtm.getNoScript();

  document.head.insertBefore(script, document.head.childNodes[0]);
  document.head.insertBefore(dataLayerScript, document.head.childNodes[0]);
  document.body.insertBefore(noScript, document.body.childNodes[0]);
};

/**
 * Function to send the events to the GTM
 * @param dataLayerName - The dataLayer name
 * @param data - The data to push
 */
export const sendToGTM = ({ dataLayerName, data }: ISendToGTM): void =>
  window[dataLayerName].push(data);
