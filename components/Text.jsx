import { useThemeColor } from '@/hooks/useThemeColor';
import {
    Text
} from 'react-native';

const CustomText = ({ type, style, ...props }) => {
  const color = useThemeColor({}, 'text');
  const error = useThemeColor({}, 'error');

  return (
    <Text
      style={[
        {
          color: type == 'error' ? error : color
        },
        style,
      ]}
      {...props}
    />
  );
}

export default CustomText;