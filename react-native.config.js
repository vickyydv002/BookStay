module.exports = {
  dependencies: {
    // Keep iOS autolink off; fonts are already in Info.plist
    'react-native-vector-icons': {
      platforms: {
        ios: null,
      },
    },
  },
  // Do NOT list Fonts here — that duplicates fonts.gradle on Android
};
