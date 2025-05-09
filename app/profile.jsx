import { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import UserContext from '@/context/UserContext';

const ProfileScreen = () => {
  const router = useRouter();
  const userContext = useContext(UserContext);

  if (!userContext) {
    return <Text>Error: UserContext not found</Text>;
  }

  const { user, logoutUser, loginUser } = userContext;

  // Temporary test user object
  const testUser = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  // photo: 'https://via.placeholder.com/80'
  };

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>No user logged in</Text>
        <TouchableOpacity onPress={() => loginUser(testUser)} style={styles.optionButton}>
          <Text style={styles.optionText}>Login as Test User</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          // source={{ uri: user?.photo || 'https://via.placeholder.com/80' }}
          // style={styles.profilePicture}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.greetingText}>Hello, {user.name}</Text>
          <Text style={styles.emailText}>{user.email}</Text>
        </View>
      </View>

      {/* Navigation Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={() => router.push('faq')}>
          <Text style={styles.optionText}>FAQ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={() => router.push('chat')}>
          <Text style={styles.optionText}>Live Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={() => router.push('feedback')}>
          <Text style={styles.optionText}>Feedback Form</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={() => router.push('terms')}>
          <Text style={styles.optionText}>Privacy Policy and Terms</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logoutUser}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    backgroundColor: '#ddd',
  },
  profileInfo: {
    flex: 1,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emailText: {
    fontSize: 16,
    color: 'gray',
  },
  optionsContainer: {
    marginBottom: 30,
  },
  optionButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  optionText: {
    fontSize: 18,
    color: '#333',
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 15,
    backgroundColor: '#dcdcdc',
    borderRadius: 5,
  },
  logoutText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
});

export default ProfileScreen;
