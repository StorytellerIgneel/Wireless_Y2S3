import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/drawer';
import Icon from '@/components/Icon'; // Import your Icon component

const DrawerToggle = () => {
  const navigation = useNavigation();

  return (
    <View style={{ marginLeft: 20 }}>
      <Icon
        name="menu"
        size={30}
        color="#07314A"
        style={{ paddingLeft: 10 }}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())} // Open the drawer using the dispatch method
      />
    </View>
  );
};

export default DrawerToggle;
