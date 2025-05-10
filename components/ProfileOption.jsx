import { useThemeColor } from '@/hooks/useThemeColor';
import { useState } from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import Icon from '@/components/Icon.jsx';
import Text from '@/components/Text.jsx';

const styles = StyleSheet.create({
    container: {
        marginTop: 4,
        marginBottom: 8,
        flexDirection: "row",
        alignItems: "center"
    },
    label: {
        fontSize: 16,
        fontWeight: 500,
        marginLeft: 24,
        flex: 1,
    },
    circle: {
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const ProfileOption = ({ icon, label, ...props }) => {
    const borderColor = useThemeColor({}, 'border');
    const backgroundColor = useThemeColor({}, 'bg_primary');
    const color = useThemeColor({}, 'text');
    const color_secondary = useThemeColor({}, 'text_secondary');

    return (
        <View style={styles.container}>
            <View style={[{ backgroundColor }, styles.circle]}>
                <Icon name={icon}/>
            </View>
            <Text
                style={styles.label}
                {...props}
            >
                {label}
            </Text>
            <Icon name={"chevron-forward-outline"} style={{color: color_secondary}}/>
        </View>
    );
}

export default ProfileOption;