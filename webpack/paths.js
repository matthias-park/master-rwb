const path = require('path');
const fs = require('fs');
const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');
const config = require('config');
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const franchiseTheme =
  (process.env.NODE_APP_INSTANCE &&
    config.has('franchises') &&
    config.get('franchises')[process.env.NODE_APP_INSTANCE].theme) ||
  '';

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  require(resolveApp('package.json')).homepage,
  process.env.PUBLIC_URL,
);

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`)),
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

const resolveFranchiseEntry = resolveFn => {
  if (franchiseTheme) {
    return resolveFn(`src/containers/${franchiseTheme}/index.tsx`);
  }
  return resolveFn(`src/index.tsx`);
};

const resolveFranchiseEntries = resolveFn => {
  const formatFranchisePath = fr => resolveFn(`src/containers/${fr}/index.tsx`);
  if (franchiseTheme) {
    return {
      [`bundle-${franchiseTheme}`]: formatFranchisePath(franchiseTheme),
    };
  }
  const franchises = fs.readdirSync('src/containers/');
  return franchises
    .filter(fr => fs.existsSync(formatFranchisePath(fr)))
    .reduce((obj, fr) => {
      obj[`bundle-${fr}`] = formatFranchisePath(fr);
      return obj;
    }, {});
};

const resolveFranchiseStyles = resolveFn => {
  const formatFranchiseStylePath = fr =>
    resolveFn(`styles/${fr}/stylesheets/main.scss`);
  if (franchiseTheme) {
    return {
      [`theme-${franchiseTheme}`]: formatFranchiseStylePath(franchiseTheme),
    };
  }
  const franchises = fs.readdirSync('styles');
  return franchises
    .filter(fr => fs.existsSync(formatFranchiseStylePath(fr)))
    .reduce((obj, fr) => {
      obj[`theme-${fr}`] = formatFranchiseStylePath(fr);
      return obj;
    }, {});
};

// config after eject: we're in ./webpack/
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appDevHtml: resolveApp('public/indexDev.html'),
  appBuildHtml: resolveApp('public/index.html'),
  appIndexJs: resolveFranchiseEntry(resolveApp),
  appIndexEntries: resolveFranchiseEntries(resolveApp),
  appStyles: resolveFranchiseStyles(resolveApp),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  proxySetup: resolveApp('src/setupProxy.js'),
  appNodeModules: resolveApp('node_modules'),
  swSrc: resolveModule(resolveApp, 'src/service-worker'),
  publicUrlOrPath,
};

module.exports.moduleFileExtensions = moduleFileExtensions;
