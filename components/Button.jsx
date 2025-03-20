import Ionicons from '@expo/vector-icons/Ionicons';
import {
    Text,
    Pressable,
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        width: "100%",
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
        marginBottom: 8,
    },
    text: {
        flex: 1,
        color: "#FFFFFF",
        textAlign: "center",
        fontWeight: "500",
    },
    icon: {
        color: "#FFFFFF"
    }
});

const Button = (props) => {
    return (
        <Pressable
            android_ripple={{color: "rgba(255, 255, 255, 0.25)", borderless: false}}
            disabled={false}
            style={[
                styles.button,
                {backgroundColor: props.active ? props.activeColor : props.color}
            ]}>
            <Ionicons
                name={props.icon}
                size={18}
                style={styles.icon}
            />
            <Text
                {...props}
                style={styles.text}
            >
                {props.title}
            </Text>
        </Pressable>
    );
}

export default Button;