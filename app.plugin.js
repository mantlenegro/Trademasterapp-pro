const { createRunOncePlugin } = require('@expo/config-plugins');

const withSharingPlugin = (config) => {
  return config;
};

module.exports = createRunOncePlugin(
  withSharingPlugin,
  'expo-sharing',
  '11.5.0'
);
