import {
  View, Text
} from 'react-native';
import notif from './index';



const App = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      {/* <Text>Your Expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      /> */}
    </View>
  )
}

export default App;