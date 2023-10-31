import { PropsWithChildren, useEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import { StatusBar, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import settingsStore from "../../features/settings/Settings.store";
import { AppTheme } from "../../theme";

type Props = {
  title: string;
};

export const AppLayout = ({ title, children }: PropsWithChildren<Props>): JSX.Element => {
  const styles = useStyles();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title });
  }, []);

  return (
    <SafeAreaView style={styles.root} edges={["bottom", "left", "right"]}>
      <StatusBar barStyle={settingsStore.darkMode ? "light-content" : "dark-content"} />

      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

const useStyles = () => {
  const theme = useTheme() as AppTheme;

  return StyleSheet.create({
    root: {
      flex: 1,
    },
    content: {
      flex: 1,
      margin: theme.spacing(1),
    },
  });
};
