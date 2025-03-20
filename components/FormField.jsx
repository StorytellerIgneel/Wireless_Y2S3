import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
    Text,
    TextInput,
    View,
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        marginTop: 4,
        marginBottom: 8
    },
    containerLabel: {
        flexDirection: "row",
        alignItems: "center"
    },
    containerInput: {
        flexDirection: "row",
        alignItems: "center",
        color: "#07314A",
        backgroundColor: "#FFFFFF",
        borderColor: "#07314A",
        borderRadius: 8,
        borderWidth: 1,
        padding: 4
    },
    invalid: {
        backgroundColor: "rgba(255, 0, 0, 0.05)",
        borderColor: "rgba(255, 0, 0, 0.5)",
    },
    icon: {
        color: "#07314A",
        margin: 4
    },
    label: {
        color: "#07314A",
        fontSize: 14,
        fontWeight: 500
    },
    input: {
        flex: 1,
        padding: 8,
        paddingTop: 6,
        paddingBottom: 6
    }
});

const FormField = (props) => {
    const [hide, setHide] = useState(props.hideable);

    return (
        <View style={styles.container}>
            <View style={styles.containerLabel}>
                <Ionicons
                    name={props.icon}
                    size={18}
                    style={styles.icon}/>
                <Text
                    {...props}
                    style={styles.label}>
                    {props.label}
                </Text>
            </View>
            <View style={[styles.containerInput, (props.invalid) ? styles.invalid : {}]}>
                <TextInput
                    style={styles.input}
                    secureTextEntry={hide}
                    maxLength={props.maxLength}
                    value={props.value}
                    onChangeText={props.onChangeText}/>
                {
                    props.hideable ? (
                        <Ionicons
                            name={hide ? "eye-off-outline" : "eye-outline"}
                            size={18}
                            style={styles.icon}
                            onPress={() => setHide(hide => !hide)}
                        />
                    ) : (
                        <></>
                    )
                }
            </View>
        </View>
    );
}

export default FormField;