/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Light
const text_primary = 'rgba(7, 49, 74, 1)';
const link = 'rgba(66, 134, 245, 1)';

const error = 'rgba(255, 0, 0, 1)';
const error_border = 'rgba(255, 0, 0, 0.5)';
const error_bg = 'rgba(255, 0, 0, 0.1)';

const btn_bg_primary = 'rgba(255, 183, 0, 1)';
const btn_bg_primary_inactive = 'rgb(255, 212, 104)';
const btn_bg_secondary = 'rgba(255, 211, 96, 1)';
const btn_bg_secondary_inactive = 'rgb(255, 231, 171)';
const btn_bg_link = 'rgba(66, 134, 245, 1)';
const btn_bg_link_inactive = 'rgb(152, 192, 255)';

const bg_primary = 'rgba(255, 255, 255, 1)';
const bg_secondary = 'rgba(0, 0, 0, 0.05)';

// Dark
const dark_text_primary = 'rgba(255, 255, 255, 1)';

const dark_error = 'rgba(255, 100, 100, 1)';
const dark_error_border = 'rgba(255, 100, 100, 0.75)';
const dark_error_bg = 'rgba(255, 100, 100, 0.2)';

const dark_bg_primary = 'rgba(3, 35, 48, 1)';
const dark_bg_secondary = text_primary;

// const tintColorLight = '#0a7ea4';
// const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: text_primary,
    link: link,
    icon: text_primary,
    border: text_primary,

    error: error,
    error_border: error_border,
    error_bg: error_bg,

    bg_primary: bg_primary,
    bg_secondary: bg_secondary,

    btn_primary: text_primary,
    btn_bg_primary: btn_bg_primary,
    btn_bg_primary_inactive: btn_bg_primary_inactive,
    btn_secondary: text_primary,
    btn_bg_secondary: btn_bg_secondary,
    btn_bg_secondary_inactive: btn_bg_secondary_inactive,
    btn_link: dark_text_primary,
    btn_bg_link: btn_bg_link,
    btn_bg_link_inactive: btn_bg_link_inactive,
    // tabIconDefault: '#687076',
    // tabIconSelected: tintColorLight,
  },
  dark: {
    text: dark_text_primary,
    link: link,
    icon: dark_text_primary,
    border: dark_text_primary,

    error: dark_error,
    error_border: dark_error_border,
    error_bg: dark_error_bg,

    bg_primary: dark_bg_primary,
    bg_secondary: dark_bg_secondary,

    btn_primary: text_primary,
    btn_bg_primary: btn_bg_primary,
    btn_bg_primary_inactive: btn_bg_primary_inactive,
    btn_secondary: text_primary,
    btn_bg_secondary: btn_bg_secondary,
    btn_bg_secondary_inactive: btn_bg_secondary_inactive,
    btn_link: dark_text_primary,
    btn_bg_link: btn_bg_link,
    btn_bg_link_inactive: btn_bg_link_inactive
    // tabIconDefault: '#9BA1A6',
    // tabIconSelected: tintColorDark,
  },
};
