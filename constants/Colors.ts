/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const textColorLight = 'rgba(7, 49, 74, 1)';
const bgPrimaryColorLight = 'rgba(255, 255, 255, 1)';
const bgSecondaryColorLight = 'rgba(0, 0, 0, 0.05)';

const textColorDark = 'rgba(255, 255, 255, 1)';
const bgPrimaryColorDark = 'rgba(3, 35, 48, 1)';
const bgSecondaryColorDark = textColorLight;
const buttonPrimary = 'rgba(255, 182, 0, 1)';
const buttonPrimaryRipple = 'rgba(230, 160, 0, 0.7)';
// const tintColorLight = '#0a7ea4';
// const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: textColorLight,
    link: 'rgba(66, 134, 245, 1)',
    primaryBackground: bgPrimaryColorLight,
    secondaryBackground: bgSecondaryColorLight,
    icon: textColorLight,
    border: textColorLight,
    // tabIconDefault: '#687076',
    // tabIconSelected: tintColorLight,
    buttonPrimary: buttonPrimary,
    buttonPrimaryRipple: buttonPrimaryRipple,
  },
  dark: {
    text: textColorDark,
    link: 'rgba(66, 134, 245, 1)',
    primaryBackground: bgPrimaryColorDark,
    secondaryBackground: bgSecondaryColorDark,
    icon: textColorDark,
    border: textColorDark
    // tabIconDefault: '#9BA1A6',
    // tabIconSelected: tintColorDark,
  },
};
