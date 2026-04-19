const { createRunOncePlugin } = require('@expo/config-plugins');

// Manual plugin to bypass the "import statement" error in SDK 50
const withLocalFix = (config) => {
  return config;
};

// Apply to both sharing and print
const withCombinedPlugins = (config) => {
  config = createRunOncePlugin(withLocalFix, 'expo-sharing', '11.5.0')(config);
  config = createRunOncePlugin(withLocalFix, 'expo-print', '12.8.1')(config);
  return config;
};

module.exports = withCombinedPlugins;
