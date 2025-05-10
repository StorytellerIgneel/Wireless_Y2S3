import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

const PercentageBar = (props) => {
  const progressBarFill = useThemeColor({}, "btn_bg_primary")
  return (
    <View style={styles.progressRow}>
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${props.percentage}%`,
              backgroundColor: progressBarFill,
            },
          ]}
        />
      </View>
      <ThemedText style={styles.percentageText}>{props.percentage}%</ThemedText>
    </View>
  );
};

const PercentageBarInline = (props) => {
  const progressBarFill = useThemeColor({}, "btn_bg_primary")
  const text = useThemeColor({}, "text")

  return (
    <View style={styles.progressRow}>
      <View
        style={[styles.progressBarContainer, styles.progressBarContainerInline]}
      >
        <View
          style={[
            styles.progressBarFill,
            styles.progressBarFillInline,
            {
              width: `${props.percentage}%`,
              backgroundColor: progressBarFill,
            },
          ]}
        />
      </View>
      <ThemedText
        style={[
          styles.percentageText,
          styles.percentageTextInline,
          { color: text },
        ]}
      >
        {props.percentage}%
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  progressRow: {
    marginBottom: 5,
  },
  progressBarContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 4,
    height: 8,
  },
  progressBarContainerInline: {
    borderRadius: 7,
    height: 20,
  },
  progressBarFill: {
    borderRadius: 4,
    height: 8,
  },
  progressBarFillInline: {
    borderRadius: 7,
    height: 20,
  },
  percentageText: {
    fontSize: 12,
    color: "#687076",
    minWidth: 35,
    textAlign: "right",
    fontWeight: 500,
  },
  percentageTextInline: {
    position: "absolute",
    flex: 1,
    alignSelf: "flex-end",
    top: -2,
    right: 10,
  },
});

export { PercentageBarInline };
export default PercentageBar;
