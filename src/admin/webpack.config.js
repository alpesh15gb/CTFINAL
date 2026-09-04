// Custom webpack override for the Medusa v1 admin UI build/dev-server.
// Loaded automatically by @medusajs/admin-ui (see getCustomWebpackConfig).
//
// Background: in a fresh install, webpack resolves to a much newer release
// than admin-ui 7.1.x was built against, and it misclassifies a handful of
// plain `.js` sources under `.cache/admin/src` (use-clipboard.js, api.js,
// filters.js, time.js) as `javascript/dynamic` (script-only). Their
// swc-loader output still contains ESM `import`/`export`, so the parse fails
// with "'import' and 'export' may appear only with 'sourceType: module'".
// Forcing `javascript/auto` restores normal ESM/script detection.
module.exports = (config) => {
  config.module.rules.push({
    test: /\.js$/,
    type: "javascript/auto",
  });
  return config;
};
