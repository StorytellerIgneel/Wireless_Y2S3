import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import {
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";

export default function Loading(props) {
  const bgColor = useThemeColor({}, "bg_primary");
  const loaderColor = useThemeColor({}, "btn_bg_primary");

  return (
    <View
      style={[styles.centeredMessageContainer, { backgroundColor: bgColor }]}
    >
      <ActivityIndicator size="large" color={loaderColor} />
      <ThemedText style={{ marginTop: 10 }}>Loading {props.item}...</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    width: '100%',
  },
});
