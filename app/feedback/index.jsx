import React, { useContext, useState, useEffect } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { PageView, FormTextView, FormView, FormField, Button, Text } from '@/components';
import { ThemedText } from '@/components/ThemedText'; 
import { send } from '@emailjs/react-native';
import UserContext from '@/context/UserContext';

export default function FeedbackScreen() {
  const [feedbackType, setFeedbackType] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useContext(UserContext);
  const router = useRouter();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user?.email || !user?.name) {
      Alert.alert(
        'Login Required',
        'Please log in to submit feedback.',
        [
          {
            text: 'OK',
            // onPress: () => router.replace('/auth/login'),
          },
        ],
        { cancelable: false }
      );
    }
  }, [user]);

  const onSubmit = async () => {
    if (!user?.email || !user?.name || !message || !feedbackType) {
      Alert.alert('Validation Error', 'All fields are required!');
      return;
    }

    try {
      await send(
        'service_v442tdd',
        'template_yqxtmac',
        {
          name: user.name,
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
        <ThemedText>
            This is the default text.
        </ThemedText>
        <ThemedText type="title">
            This is a title.
        </ThemedText>
        <ThemedText type="subtitle">
            This is a subtitle.
        </ThemedText>
        <ThemedText type="subtitleGrey">
            This is a grey subtitle.
        </ThemedText>
      <FormView>
        <FormField
          label="Username"
          placeholder={user?.name}  
          editable={false}
          icon="person-outline"
          unstyled
        />
        <FormField
          label="E-mail address"
          placeholder={user?.email}
          editable={false}
          icon="mail-outline"
          unstyled
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
                // styles.buttonText,
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
          numberOfLines={5}
          icon="pencil-outline"
        />

        <Button
          title="Submit"
          noBorder
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
    gap: 8,
    marginBottom: 20,
  },
  feedbackButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    // borderColor: '#ccc',
    paddingVertical: 8,
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
    backgroundColor: 'transparent',
  },
});
