import {
    View,
    StyleSheet
} from 'react-native';
import Text from '@/components/Text.jsx';
import Checkbox from 'expo-checkbox';

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    margin: 8
  }
});

const CustomCheckbox = ({ label, style, ...props }) => {
  return (
    <View style={styles.container}>
        <Checkbox {...props} />
        <Text>{label}</Text>
    </View>
  );
}

export default CustomCheckbox;