// import { useState } from 'react';
// // import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
// import { send, EmailJSResponseStatus } from '@emailjs/react-native';
// // import styles from 'stylesheet';

// const FeedbackScreen = () => {
//   const [name, setName] = useState();
//   const [email, setEmail] = useState();
//   const [type, setType] = useState();
//   const [message, setMessage] = useState();

//   const onSubmit = async () => {
//     if (!email || !name) {
//       console.log('Email and Name are required!');
//       return;
//     }
//     try {
//       await send(
//         'service_v442tdd',
//         'template_yqxtmac',
//         {
//           name: name,
//           email: email,
//           message: message,
//         },
//         {
//           publicKey: '3n8xXSvm4KPDChxv-',
//         },
//       );

//       console.log('SUCCESS!');
//     } catch (err) {
//       if (err instanceof EmailJSResponseStatus) {
//         console.log('EmailJS Request Failed...', err);
//       }

//       console.log('ERROR', err);
//     }
//   };

//   return (
//     <View>
//       <TextInput style={{backgroundColor: "blue",  color: 'white'}}
//         inputMode="email"
//         keyboardType="email-address"
//         textContentType="emailAddress"
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput style={{backgroundColor: "blue", color: 'white'}}
//         inputMode="text"
//         placeholder="Name"
//         value={name}
//         onChangeText={setName}
//       />
//       <TextInput style={{backgroundColor: "blue", color: 'white'}}
//         inputMode="text"
//         placeholder="Message"
//         value={message}
//         onChangeText={setMessage}
//       />
//       <Button title="Submit" onPress={onSubmit} />
//     </View>
//   );
// };

// export default FeedbackScreen;

import React, { useContext, useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { PageView, FormView, FormField, Button, Text, Icon } from '@/components';
import { send } from '@emailjs/react-native';
import UserContext from '@/context/UserContext';

export default function FeedbackScreen({ navigation }) {
  const { user } = useContext(UserContext);
  const [feedbackType, setFeedbackType] = useState('Problems');
  const [message, setMessage] = useState('');

  const onSubmit = async () => {
    if (!user?.email || !user?.name || !message) {
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
    } catch (err) {
      console.log('EmailJS error:', err);
      Alert.alert('Error', 'Failed to send feedback.');
    }
  };

  return (
    <PageView header="Feedback">
      <FormView>
        <FormField
          label="Username"
          value={user?.name || ''}
          editable={false}
          icon="person-outline"
        />
        <FormField
          label="E-mail address"
          value={user?.email || ''}
          editable={false}
          icon="mail-outline"
        />
        <Text style = {{fontSize: 14, fontWeight: 500}}>
          Feedback Type
        </Text>
        {['Problems', 'Comments', 'Suggestions'].map(type => (
          <Button
            key={type}
            title={type}
            // type={feedbackType === type ? 'primary' : 'outline'}
            onPress={() => setFeedbackType(type)}
            style={{ flex: 1 }}
            backgroundColor="rgba(109, 120, 126, 1)"
            activeBackgroundColor="rgba(66, 134, 245, 1)"
          />
        ))}
        <FormField
          label="Description"
          value={message}
          onChangeText={setMessage}
          placeholder="Describe your issue or feedback..."
          multiline
          numberOfLines={5}
          icon="pencil-outline"
        />
      </FormView>
    </PageView>
  );
}


// <ScrollView contentContainerStyle={{ padding: 20 }}>
// </ScrollView>

        {/* <Button type="primary" onPress={onSubmit} style={{ marginTop: 20 }}>
          Submit Feedback
        </Button> */}

        {/* <Button
          type="ghost"
          icon={{ name: 'arrow-back', library: 'Ionicons', size: 24, color: '#002b5b' }}
          onPress={() => navigation.goBack()}
          style={{ marginBottom: 10, alignSelf: 'flex-start' }}
        /> */}