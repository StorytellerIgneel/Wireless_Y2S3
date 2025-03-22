import { Link } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import {
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    hyperlink: {
        textDecorationLine: "underline",
    }
});

const CustomLink = ({ style, ...props}) => {
    const color = useThemeColor({}, 'link');

    return (
        <Link
            style={[
                {color},
                styles.hyperlink,
                style
            ]}
            {...props}
        />
    );
}

export default CustomLink;