import {
    Pressable,
    StyleSheet
} from 'react-native';
import {
    Icon,
    Text
} from '@/components';

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

const Button = ({ title, active, activeBackgroundColor, backgroundColor, activeColor, color, icon, style, ...props }) => {    
    return (
        <Pressable
            android_ripple={{color: "rgba(255, 255, 255, 0.25)", borderless: false}}
            disabled={false}
            style={[
                (active) ?
                    {backgroundColor: activeBackgroundColor, opacity: 1} :
                    {backgroundColor: backgroundColor, opacity: 0.5},
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
                        {color: activeColor} :
                        {color: color},
                    styles.text
                ]}
            >
                {title}
            </Text>
        </Pressable>
    );
}

export default Button;