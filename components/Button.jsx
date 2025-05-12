import { useThemeColor } from "@/hooks/useThemeColor";
import { Pressable, StyleSheet } from "react-native";
import Icon from "@/components/Icon.jsx";
import Text from "@/components/Text.jsx";

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    width: "100%",
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    justifyContent: "center", // center horizontally
    alignItems: "center", // center vertically
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
});

const Button = ({
  type = "primary",
  title,
  active,
  activeBackgroundColor,
  backgroundColor,
  activeColor,
  color,
  icon,
  style,
  rounded,
  circle,
  noBorder = false, // ✅ Add this
  ...props
}) => {
  const btn_primary = useThemeColor({}, "btn_primary");
  const btn_primary_inactive = useThemeColor({}, "btn_primary_inactive");
  const btn_bg_primary = useThemeColor({}, "btn_bg_primary");
  const btn_bg_primary_inactive = useThemeColor({}, "btn_bg_primary_inactive");

  const btn_secondary = useThemeColor({}, "btn_secondary");
  const btn_secondary_inactive = useThemeColor({}, "btn_secondary_inactive");
  const btn_bg_secondary = useThemeColor({}, "btn_bg_secondary");
  const btn_bg_secondary_inactive = useThemeColor(
    {},
    "btn_bg_secondary_inactive"
  );

  const btn_link = useThemeColor({}, "btn_link");
  const btn_link_inactive = useThemeColor({}, "btn_link_inactive");
  const btn_bg_link = useThemeColor({}, "btn_bg_link");
  const btn_bg_link_inactive = useThemeColor({}, "btn_bg_link_inactive");

  const btn_danger = useThemeColor({}, "btn_danger");
  const btn_danger_inactive = useThemeColor({}, "btn_danger_inactive");
  const btn_bg_danger = useThemeColor({}, "btn_bg_danger");
  const btn_bg_danger_inactive = useThemeColor({}, "btn_bg_danger_inactive");
  // ... your theme colors

  return (
    <Pressable
      android_ripple={{
        color: "rgba(255, 255, 255, 0.25)",
        borderless: false,
      }}
      disabled={false}
      style={[
        active
          ? {
              backgroundColor:
                activeBackgroundColor ?? type == "primary"
                  ? btn_bg_primary
                  : type == "secondary"
                  ? btn_bg_secondary
                  : type == "link"
                  ? btn_bg_link
                  : type == "danger"
                  ? btn_bg_danger
                  : btn_bg_primary,
            }
          : {
              backgroundColor:
                backgroundColor ?? type == "primary"
                  ? btn_bg_primary_inactive
                  : type == "secondary"
                  ? btn_bg_secondary_inactive
                  : type == "link"
                  ? btn_bg_link_inactive
                  : type == "danger"
                  ? btn_bg_danger_inactive
                  : btn_bg_primary_inactive,
            },
        rounded
          ? {
              borderRadius: 20,
            }
          : circle
          ? {
              borderRadius: 100,
            }
          : {
              borderRadius: 8,
            },
        styles.button,
        style,
      ]}
      {...props}
    >
      {icon && <Icon name={icon} style={[styles.icon, { color }]} />}
      {title && (
        <Text
          style={[
            active
              ? {
                  color:
                    activeColor ?? type == "primary"
                      ? btn_primary
                      : type == "secondary"
                      ? btn_secondary
                      : type == "link"
                      ? btn_link
                      : type == "danger"
                      ? btn_danger
                      : btn_primary,
                }
              : {
                  color:
                    color ?? type == "primary"
                      ? btn_primary_inactive
                      : type == "secondary"
                      ? btn_secondary_inactive
                      : type == "link"
                      ? btn_link_inactive
                      : type == "danger"
                      ? btn_danger_inactive
                      : btn_primary_inactive,
                },
            styles.text,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

export default Button;
