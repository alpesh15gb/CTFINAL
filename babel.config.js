// Babel config for the Medusa v1 backend (`medusa develop` / `medusa build`
// transpile `src/` with this). The backend currently has no custom code, so
// `src/` only holds a placeholder — this file must still exist or the
// `babel src -d dist` step in the Medusa CLI fails.
module.exports = {
  presets: ["babel-preset-medusa-package"],
};
