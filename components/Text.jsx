import { useThemeColor } from '@/hooks/useThemeColor';
import {
    Text
} from 'react-native';

const CustomText = ({ style, ...props }) => {
  const color = useThemeColor({}, 'text');

  return (
    <Text
      style={[
        { color },
        style,
      ]}
      {...props}
    />
  );
}

export default CustomText;