// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';

// Define allowed icon libraries
type IconLibrary = 'MaterialIcons' | 'MaterialCommunityIcons';

// Each mapping entry holds the icon name and which library to use
type IconMappingEntry = {
  name: string;
  library: IconLibrary;
};

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  'house.fill': { name: 'home', library: 'MaterialIcons' },
  'paperplane.fill': { name: 'send', library: 'MaterialIcons' },
  'chevron.left.forwardslash.chevron.right': { name: 'code', library: 'MaterialIcons' },
  'chevron.right': { name: 'chevron-right', library: 'MaterialIcons' },
  'search.fill': { name: 'search', library: 'MaterialIcons' },
  'shelf.fill': { name: 'bookshelf', library: 'MaterialCommunityIcons' },
  'chat.fill' : { name: 'chat', library: 'MaterialCommunityIcons'},
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    IconMappingEntry
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  const mapping = MAPPING[name];

  if (!mapping) return null;

  const { name: iconName, library } = mapping;

  if (library === 'MaterialIcons') {
    return (
      <MaterialIcons
        name={iconName as React.ComponentProps<typeof MaterialIcons>['name']}
        size={size}
        color={color}
        style={style}
      />
    );
  } else if (library === 'MaterialCommunityIcons') {
    return (
      <MaterialCommunityIcons
        name={iconName as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
        size={size}
        color={color}
        style={style}
      />
    );
  }

  return null;
}
