import { Pressable, StyleSheet } from "react-native";
import { Icon, Text } from "@/components";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";

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
    color: "rgba(255, 255, 255, 1)",
    margin: 0,
  },
  buttonPrimary: {
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 20, 
    alignItems: "center",
    alignSelf: "flex-end",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  }
});

const Button = ({
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
  return (
    <Pressable
      android_ripple={{ color: "rgba(255, 255, 255, 0.25)", borderless: false }}
      disabled={false}
      style={[
        active
          ? { backgroundColor: activeBackgroundColor, opacity: 1 }
          : { backgroundColor: backgroundColor, opacity: 0.5 },
        styles.button,
        style,
      ]}
      {...props}
    >
      <Icon name={icon} style={styles.icon} />
      <Text
        style={[
          active ? { color: activeColor } : { color: color },
          styles.text,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const PrimaryButton = ({ title, icon, style, ...props }) => {
  return (
    <Pressable
      android_ripple={{
        color: Colors.light.buttonPrimaryRipple,
        borderless: false,
      }}
      style={[
        styles.buttonPrimary,
        { backgroundColor: Colors.light.buttonPrimary },
        style,
      ]}
      {...props}
    >
      {icon && <Icon name={icon} style={styles.icon} />}
      <ThemedText 
        type="defaultSemiBold" style={[styles.buttonText, {color: Colors.light.text}]}
      >
        {title}
      </ThemedText>
    </Pressable>
  );
};

export { PrimaryButton };
export default Button;
