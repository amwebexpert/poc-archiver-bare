import { useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import { AppTheme } from "../../../../theme";

export const useStyles = () => {
  const theme = useTheme() as AppTheme;

  return StyleSheet.create({
    colorPicker: {
      height: 300,
      borderRadius: 10,
      marginBottom: 20,
    },
  });
};
