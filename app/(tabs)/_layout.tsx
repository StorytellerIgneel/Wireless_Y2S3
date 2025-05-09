import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const TabLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        // Tab icon logic: fallback to IconSymbol for home, Ionicons otherwise
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'index') {
            return <IconSymbol size={28} name="house.fill" color={color} />;
          } else if (route.name === 'search') {
            return <IconSymbol size={size} name="search.fill" color={color} />;
          } else if (route.name === 'bookshelf') {
            return <IconSymbol size={size} name="shelf.fill" color={color} />;
          } else if (route.name === 'rooms'){
            return <IconSymbol size={size} name="chat.fill" color={color} />;
          }
          else {
            return null; 
          }
        },
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          // Already handled by tabBarIcon above
        }}
      />
      
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
        }}
      />

      <Tabs.Screen
        name="bookshelf"
        options={{
          title: 'My Shelf',
        }}
      />
      <Tabs.Screen
      name="non_tabs/booklist"
      options={{
          href: null,
      }}
      />
      {/* 
        Admendment by Jing Hoe, 6/3/2025 11:11AM
        Action: Commented out codes below
        Reason: Explore page no longer existed 
      */}
      {/* <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      /> */}
    </Tabs>
  );
}

export default TabLayout;