import { useTheme } from "react-native-paper";
import { AppTheme } from "../../theme";
import { StyleSheet } from "react-native";

export const paintCommonStyles = StyleSheet.create({
  container: {
    borderColor: "black",
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
  },
});

export const useStyles = () => {
  const theme = useTheme() as AppTheme;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    expandableToolbar: {
      backgroundColor: "black",
      flexDirection: "row",
      justifyContent: "flex-end",
      position: "absolute",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "green",
      borderRadius: 4,
      right: 0,
      bottom: -8,
    },
    canvasWrapper: {
      backgroundColor: "white",
      borderColor: "lightgray",
      borderWidth: StyleSheet.hairlineWidth,
      overflow: "hidden",
      padding: 0,
    },
  });
};
