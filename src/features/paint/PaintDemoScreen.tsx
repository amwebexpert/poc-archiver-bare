import { FunctionComponent } from "react";

import { observer } from "mobx-react";
import { StyleSheet, View } from "react-native";
import { useTheme, Text } from "react-native-paper";

import { AppLayout } from "../../components/layout/AppLayout";
import { AppTheme } from "../../theme";

const PaintDemoScreen: FunctionComponent = () => {
  const styles = useStyles();

  return (
    <AppLayout title="Paint App demo">
      <View style={styles.root}>
        <Text>Paint App demo</Text>
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

export default observer(PaintDemoScreen);
