import {
    View,
    Text,
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        opacity: 0.5
    },
    line: {
        flexGrow: 1,
        height: 1,
        backgroundColor: "#000000",
        margin: 12
    },
    text: {
        flex: 0.4,
        textAlign: "center"
    }
});

const Divider = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.line}></View>
            <Text style={styles.text}>{props.text}</Text>
            <View style={styles.line}></View>
        </View>
    );
}

export default Divider;