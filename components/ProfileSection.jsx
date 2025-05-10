import { useThemeColor } from '@/hooks/useThemeColor';
import {
    View,
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    }
});

const ProfileSection = ({ style, ...props }) => {
    const backgroundColor = useThemeColor({}, 'bg_secondary');

    return (
        <View
            style={[
                {backgroundColor},
                styles.container,
                style
            ]}
            {...props}
        />
    );
}

export default ProfileSection;