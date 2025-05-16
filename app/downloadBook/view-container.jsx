import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';

const App = () => {
    const { uri } = useLocalSearchParams();

    return (
        <View>
            <Text>{uri}</Text>
            <Text>{uri}</Text>
            <WebView source={{ uri: uri }} />
        </View>
    );
}

export default App;