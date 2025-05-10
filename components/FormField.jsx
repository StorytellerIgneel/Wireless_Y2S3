import { useThemeColor } from '@/hooks/useThemeColor';
import { useState } from 'react';
import {
    TextInput,
    View,
    StyleSheet
} from 'react-native';
import Icon from '@/components/Icon.jsx';
import Text from '@/components/Text.jsx';

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
        borderRadius: 8,
        borderWidth: 1,
        padding: 4
    },
    label: {
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

const FormField = ({ icon, label, hideable, invalid, onChangeText, ...props }) => {
    const borderColor = useThemeColor({}, 'border');
    const backgroundColor = useThemeColor({}, 'bg_primary');
    const color = useThemeColor({}, 'text');
    const error = useThemeColor({}, 'error');
    const error_bg = useThemeColor({}, 'error_bg');
    const error_border = useThemeColor({}, 'error_border');

    const [hide, setHide] = useState(hideable);
    const [value, setValue] = useState('');

    return (
        <View style={styles.container}>
            <View style={styles.containerLabel}>
                <Icon name={icon}/>
                <Text
                    style={styles.label}
                    {...props}
                >
                    {label}
                </Text>
            </View>
            <View style={[
                (invalid) ?
                    {
                        backgroundColor: error_bg,
                        borderColor: error_border
                    } :
                    {
                        backgroundColor,
                        borderColor
                    },
                styles.containerInput
            ]}>
                <TextInput
                    style={[{color, opacity: (value) ? 1 : 0.2}, styles.input]}
                    secureTextEntry={hide}
                    placeholderTextColor={color}
                    onChangeText={(newValue) => {
                        setValue(newValue);
                        onChangeText(newValue);
                    }}
                    {...props}
                />
                {
                    hideable ? (
                        <Icon
                            name={hide ? "eye-off-outline" : "eye-outline"}
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