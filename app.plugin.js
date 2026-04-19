// app.plugin.js
const { createRunOncePlugin } = require('@expo/config-plugins');

// This manual plugin bypasses the broken auto-detection in expo-sharing
const withSharingPlugin = (config) => {
  return config;
};

module.exports = createRunOncePlugin(
  withSharingPlugin,
  'expo-sharing',
  '11.5.0'
);
