import React, { useContext, useState, useEffect } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { PageView, FormView, FormField, Button, Text } from '@/components';
import { send } from '@emailjs/react-native';
import UserContext from '@/context/UserContext';

export default function FeedbackScreen() {
  const [feedbackType, setFeedbackType] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useContext(UserContext);
  const router = useRouter();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user?.email || !user?.username) {
      Alert.alert(
        'Login Required',
        'Please log in to submit feedback.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/auth/login'),
          },
        ],
        { cancelable: false }
      );
    }
  }, [user]);

  const onSubmit = async () => {
    if (!user?.email || !user?.username || !message || !feedbackType) {
      Alert.alert('Validation Error', 'All fields are required!');
      return;
    }

    try {
      await send(
        'service_v442tdd',
        'template_yqxtmac',
        {
          name: user.username,
          email: user.email,
          message: `${feedbackType}: ${message}`,
        },
        { publicKey: '3n8xXSvm4KPDChxv-' }
      );

      Alert.alert('Success', 'Feedback sent successfully!');
      setMessage('');
      setFeedbackType('');
    } catch (err) {
      console.log('EmailJS error:', err);
      Alert.alert('Error', 'Failed to send feedback.');
    }
  };

  return (
    <PageView header="Feedback" type={'back'}>
      <FormView>
        <FormField
          label="Username"
          value={user?.username}  
          editable={false}
          icon="person-outline"
          transparent={true}
        />

        <FormField
          label="E-mail address"
          value={user?.email}
          editable={false}
          icon="mail-outline"
          transparent={true}
        />
        <Text style={styles.label}>Feedback Type</Text>
        <View style={styles.buttonRow}>
          {['Problems', 'Comments', 'Suggestions'].map(type => (
            <Button
              key={type}
              title={type}
              onPress={() => setFeedbackType(type)}
              style={[
                styles.feedbackButton,
                feedbackType === type && styles.selectedButton,
              ]}
              textStyle={[
                feedbackType === type && styles.selectedText,
              ]}
            />
          ))}
        </View>

        <FormField
          label="Description"
          value={message}
          onChangeText={setMessage}
          placeholder="Describe your issue or feedback..."
          multiline
          numberOfLines={10}
          icon="pencil-outline"
        />

        <Button
          title="Submit"
          onPress={onSubmit}
          style={[
            styles.submitButton,
            message && feedbackType && styles.selectedButton,
          ]}
          textStyle={[
            styles.buttonText,
            message && feedbackType && styles.selectedText,
          ]}
        />
      </FormView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  feedbackButton: {
    flex: 1,
    minWidth: 105, 
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center', 
    minHeight: 40,
    marginHorizontal: 3,  // Add horizontal margin to create space between buttons
  },
  selectedButton: {
    backgroundColor: '#FFD700', // Yellow
    borderColor: '#FFD700',
  },
  selectedText: {
    color: '#000',
    fontWeight: 'bold',
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#d3d3d3',
  },
});
