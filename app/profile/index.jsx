import React, { useContext } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import UserContext from '@/context/UserContext';
import {
  Text,
  Button,
  PageView,
  ProfileOption,
  ProfileSection
} from "@/components";

const ProfileScreen = () => {
  const router = useRouter();

  const userContext = useContext(UserContext);

  const { user, logoutUser } = userContext;

  return (
    <PageView header="Profile" type="back">
        <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: user?.photo || "https://avatar.iran.liara.run/username?username=" + (user ? user.username : "Guest") }}
            style={styles.profilePicture}
          />
          {user ? (
            <View style={styles.profileInfo}>
              <Text style={styles.greetingText}>Hello, {user.username}</Text>
              <Text style={styles.emailText}>{user.email}</Text>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <Text style={styles.greetingText}>Hello, Visitor</Text>
              <Button
                title="Login"
                active
                rounded
                onPress={() => router.navigate("/auth/login")}
              />
            </View>
          )}
        </View>

        {/* Navigation Options */}
        <ProfileSection>
          <ProfileOption
            icon={"phone-portrait-outline"}
            label={"Display Settings"}
            onPress={() => router.push('/faq')}
          />
          <ProfileOption
            icon={"notifications-outline"}
            label={"Notification Settings"}
            onPress={() => router.push('/faq')}
          />
        </ProfileSection>

        <ProfileSection>
          <ProfileOption
            icon={"help-circle-outline"}
            label={"FAQ"}
            onPress={() => router.push('/faq')}
          />
          <ProfileOption
            icon={"chatbubbles-outline"}
            label={"Live Chat"}
            onPress={() => router.push('/testgrounds/Rooms')}
          />
          <ProfileOption
            icon={"archive-outline"}
            label={"Feedback Form"}
            onPress={() => router.push('/feedback')}
          />
          <ProfileOption
            icon={"newspaper-outline"}
            label={"Terms & Conditions"}
            onPress={() => router.push('/terms')}
          />
          <ProfileOption
            icon={"shield-checkmark-outline"}
            label={"Privacy Policy"}
            onPress={() => router.push('/privacy')}
          />
        </ProfileSection>

        {/* Logout Button */}
        {user ? (
          <Button
            title="Log Out"
            type="danger"
            active
            onPress={logoutUser}
          />
        ) : undefined}
        </ScrollView>
    </PageView>
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
    width: 104,
    height: 104,
    borderRadius: 52,
    marginRight: 24,
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
});

export default ProfileScreen;
