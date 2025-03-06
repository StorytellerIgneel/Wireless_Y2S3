import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import UserContext from '../../context/UserContext';

const ProfileScreen = () => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    return <Text>Error: UserContext not found</Text>;
  }

  const { user, logoutUser } = userContext;

  return (
    <View>
      {user ? (
        <>
          <Text>Welcome, {user.name}!</Text>
          <Text>Email: {user.email}</Text>
          <Button title="Logout" onPress={logoutUser} />
        </>
      ) : (
        <Text>No user logged in</Text>
      )}
    </View>
  );
};

export default ProfileScreen;
