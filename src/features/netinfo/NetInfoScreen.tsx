import { FunctionComponent, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

import { AppLayout } from "../../components/layout/AppLayout";
import { useSnackbar } from "../../components/snack-bar/SnackbarProvider";
import { AppTheme } from "../../theme";

type State = {
  type?: string;
  isConnected?: boolean | null;
};

const NetInfoScreen: FunctionComponent = () => {
  const styles = useStyles();
  const [state, setState] = useState<State>({});

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => setState(state));

    return unsubscribe;
  }, []);

  return (
    <AppLayout title="Settings screen">
      <View style={styles.root}>
        <Text variant="headlineMedium">Network state detection</Text>
        <Text>Is connected: {`${state.isConnected}`}</Text>
        <Text>Connection type: {state.type}</Text>
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

export default NetInfoScreen;
