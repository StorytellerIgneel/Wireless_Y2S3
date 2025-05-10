import { useThemeColor } from '@/hooks/useThemeColor';
import {
    Text,
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
  block: {
    padding: 12
  },
  bold: {
    fontWeight: 'bold'
  }
});

const CustomText = ({ type, style, ...props }) => {
  const color = useThemeColor({}, 'text');
  const error = useThemeColor({}, 'error');

  return (
    <Text
      style={[
        {
          color: type == 'error' ? error : color
        },
        type == 'block' ? styles.block : undefined,
        type == 'bold' ? styles.bold : undefined,
        style,
      ]}
      {...props}
    />
  );
}

export default CustomText;