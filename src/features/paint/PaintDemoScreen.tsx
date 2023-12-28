import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FunctionComponent } from "react";

import { observer } from "mobx-react";
import { StyleSheet, View } from "react-native";
import { useTheme, Text } from "react-native-paper";

import { AppLayout } from "../../components/layout/AppLayout";
import { AppTheme } from "../../theme";

const PaintDemoScreen: FunctionComponent = () => {
  const styles = useStyles();

  // @see https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/handling-gestures/#handling-tap-gestures
  return (
    <AppLayout title="Paint App demo">
      <GestureHandlerRootView style={styles.root}>
        <Text>Paint App demo</Text>
      </GestureHandlerRootView>
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

export default observer(PaintDemoScreen);
