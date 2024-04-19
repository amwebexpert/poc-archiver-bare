module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    [
      "module:react-native-dotenv",
      {
        allowUndefined: false,
      },
    ],
    // @see https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/#step-2-add-reanimateds-babel-plugin
    // react-native-reanimated/plugin has to be listed last.
    "react-native-reanimated/plugin",
  ],
  env: {
    production: {
      plugins: ["react-native-paper/babel"],
    },
  },
};
