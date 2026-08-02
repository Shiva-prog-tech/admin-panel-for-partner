// ===========================================================================
// PostCSS pipeline.
//
// Declaring this file makes Next.js use it *instead of* its built-in pipeline,
// so the plugin list below deliberately reproduces Next's defaults rather than
// replacing them. Dropping to `{ plugins: {} }` would silently switch off
// autoprefixing and the flexbox bug fixes — a rendering regression no test in
// this repo would catch.
//
// Keep in sync with Next's defaults if you upgrade:
// https://nextjs.org/docs/app/guides/post-css
// ===========================================================================

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "postcss-flexbugs-fixes": {},
    "postcss-preset-env": {
      autoprefixer: {
        flexbox: "no-2009",
      },
      stage: 3,
      features: {
        // Custom properties are the theming mechanism (see styles/globals.css);
        // they must reach the browser untouched so runtime theme switching works.
        "custom-properties": false,
      },
    },
  },
};

export default config;
