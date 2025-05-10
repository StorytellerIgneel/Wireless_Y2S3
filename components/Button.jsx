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
                activeBackgroundColor ??
                (type === "primary"
                  ? btn_bg_primary
                  : type === "secondary"
                  ? btn_bg_secondary
                  : type === "link"
                  ? btn_bg_link
                  : type === "danger"
                  ? btn_bg_danger
                  : btn_bg_primary),
            }
          : {
              backgroundColor:
                backgroundColor ??
                (type === "primary"
                  ? btn_bg_primary_inactive
                  : type === "secondary"
                  ? btn_bg_secondary_inactive
                  : type === "link"
                  ? btn_bg_link_inactive
                  : type === "danger"
                  ? btn_bg_danger_inactive
                  : btn_bg_primary_inactive),
            },
        !noBorder && {
          borderWidth: 1, // ✅ Default border
          borderColor: "transparent", // or your default color
        },
        rounded
          ? { borderRadius: 20 }
          : circle
          ? { borderRadius: 100 }
          : { borderRadius: 8 },
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
                    activeColor ??
                    (type === "primary"
                      ? btn_primary
                      : type === "secondary"
                      ? btn_secondary
                      : type === "link"
                      ? btn_link
                      : type === "danger"
                      ? btn_danger
                      : btn_primary),
                }
              : {
                  color:
                    color ??
                    (type === "primary"
                      ? btn_primary_inactive
                      : type === "secondary"
                      ? btn_secondary_inactive
                      : type === "link"
                      ? btn_link_inactive
                      : type === "danger"
                      ? btn_danger_inactive
                      : btn_primary_inactive),
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
