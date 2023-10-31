import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

import { AppLayout } from "../../components/layout/AppLayout";
import { AppTheme } from "../../theme";

const StyledComponentsScreen = (): JSX.Element => {
  const styles = useStyles();

  return (
    <AppLayout title="Settings screen">
      <View style={styles.root}>
        <Text>Styled</Text>
      </View>
    </AppLayout>
  );
};

const useStyles = () => {
  const theme = useTheme() as AppTheme;

  return StyleSheet.create({
    root: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });
};

export default StyledComponentsScreen;
