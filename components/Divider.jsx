import { useThemeColor } from '@/hooks/useThemeColor';
import {
    View,
    StyleSheet
} from 'react-native';
import {
    Text
} from '@/components';

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        opacity: 0.5
    },
    line: {
        flexGrow: 1,
        height: 1,
        margin: 12
    },
    text: {
        flex: 0.4,
        textAlign: "center"
    }
});

const Divider = (props) => {
    const backgroundColor = useThemeColor({}, 'text');
    const color = backgroundColor;

    return (
        <View style={styles.container}>
            <View style={[{backgroundColor}, styles.line]}></View>
            <Text style={[{color}, styles.text]}>{props.text}</Text>
            <View style={[{backgroundColor}, styles.line]}></View>
        </View>
    );
}

export default Divider;