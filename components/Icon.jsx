import { useThemeColor } from '@/hooks/useThemeColor';
import Ionicons from '@expo/vector-icons/Ionicons';

const Icon = ({ style, ...props }) => {
    const color = useThemeColor({}, 'icon');

    return (
        <Ionicons
            size={18}
            color={color}
            style={[
                { margin: 4 },
                style
            ]}
            {...props}
        />
    );
}

export default Icon;