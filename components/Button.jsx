import { useThemeColor } from '@/hooks/useThemeColor';
import {
    Pressable,
    StyleSheet
} from 'react-native';
import Icon from '@/components/Icon.jsx';
import Text from '@/components/Text.jsx';

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
        textAlign: "center",
        fontWeight: "500",
    },
    icon: {
        color: 'rgba(255, 255, 255, 1)',
        margin: 0
    }
});

const Button = ({
    type = 'primary',
    title,
    active,
    activeBackgroundColor,
    backgroundColor,
    activeColor,
    color,
    icon,
    style,
    ...props
 }) => {
    const btn_primary = useThemeColor({}, 'btn_primary');
    const btn_primary_inactive = useThemeColor({}, 'btn_primary_inactive');
    const btn_bg_primary = useThemeColor({}, 'btn_bg_primary');
    const btn_bg_primary_inactive = useThemeColor({}, 'btn_bg_primary_inactive');

    const btn_secondary = useThemeColor({}, 'btn_secondary');
    const btn_secondary_inactive = useThemeColor({}, 'btn_secondary_inactive');
    const btn_bg_secondary = useThemeColor({}, 'btn_bg_secondary');
    const btn_bg_secondary_inactive = useThemeColor({}, 'btn_bg_secondary_inactive');

    const btn_link = useThemeColor({}, 'btn_link');
    const btn_link_inactive = useThemeColor({}, 'btn_link_inactive');
    const btn_bg_link = useThemeColor({}, 'btn_bg_link');
    const btn_bg_link_inactive = useThemeColor({}, 'btn_bg_link_inactive');

    return (
        <Pressable
            android_ripple={{color: "rgba(255, 255, 255, 0.25)", borderless: false}}
            disabled={false}
            style={[
                (active) ?
                    {
                        opacity: 1,
                        backgroundColor: activeBackgroundColor ??
                            type == 'primary' ? btn_bg_primary :
                            type == 'secondary' ? btn_bg_secondary : 
                            type == 'link' ? btn_bg_link : btn_bg_primary,
                    } :
                    {
                        opacity: 0.5,
                        backgroundColor: backgroundColor ??
                            type == 'primary' ? btn_bg_primary_inactive :
                            type == 'secondary' ? btn_bg_secondary_inactive : 
                            type == 'link' ? btn_bg_link_inactive : btn_bg_primary_inactive
                    },
                styles.button,
                style,
            ]}
            {...props}
        >
            <Icon
                name={icon}
                style={styles.icon}
            />
            <Text
                style={[
                    (active) ?
                        {
                            color: activeColor ??
                                type == 'primary' ? btn_primary :
                                type == 'secondary' ? btn_secondary : 
                                type == 'link' ? btn_link : btn_primary,
                        } :
                        {
                            color: color ??
                                type == 'primary' ? btn_primary_inactive :
                                type == 'secondary' ? btn_secondary_inactive : 
                                type == 'link' ? btn_link_inactive : btn_primary_inactive,
                        },
                    styles.text
                ]}
            >
                {title}
            </Text>
        </Pressable>
    );
}

export default Button;