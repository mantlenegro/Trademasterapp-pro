module.exports = {
  expo: {
    name: "Trade Academy Pro",
    slug: "trademasterapp",
    version: "1.0.2",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark",
    backgroundColor: "#0F172A",
    ios: {
      bundleIdentifier: "com.mantlenegro.tradeacademypro.app",
      supportsTablet: true
    },
    android: {
      package: "com.mantlenegro.tradeacademypro.app",
      versionCode: 1,
      permissions: ["INTERNET", "READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE"],
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#0F172A"
      }
    },
    plugins: [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-9598335800956469~1158817426",
          "iosAppId": "ca-app-pub-9598335800956469~1158817426"
        }
      ],
      "expo-notifications",
      "./app.plugin.js"
    ],
    extra: {
      eas: { projectId: "1eb82123-854b-4fa8-b8e0-ed0b691e0444" }
    }
  }
};
