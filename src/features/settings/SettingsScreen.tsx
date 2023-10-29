import { useEffect } from "react";

import { View, StyleSheet } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { observer } from "mobx-react";

import { AppLayout } from "../../components/layout/AppLayout";
import { AppTheme } from "../../theme";
import settingsStore from "./Settings.store";
import { useSnackbar } from "../../components/snack-bar/SnackbarProvider";

const SettingsScreen = (): JSX.Element => {
  const styles = useStyles();
  const { showSnackbarMessage } = useSnackbar();

  useEffect(() => {
    if (settingsStore.darkMode) {
      showSnackbarMessage("Dark mode is enabled");
    }
  }, [settingsStore.darkMode]);

  return (
    <AppLayout title="Settings screen">
      <View style={styles.root}>
        <Text>{`${settingsStore.darkMode}`}</Text>

        <Button icon="switch" mode="outlined" onPress={() => settingsStore.toggleDarkMode()}>
          Toggle Dark mode
        </Button>
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
    params: {
      flex: 1,
      width: "100%",
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
  });
};

export default observer(SettingsScreen);
