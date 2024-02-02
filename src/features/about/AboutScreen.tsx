import { FlashList } from "@shopify/flash-list";
import { FunctionComponent } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { List, useTheme } from "react-native-paper";

import { AppLayout } from "../../components/layout/AppLayout";
import { AppTheme } from "../../theme";

import { observer } from "mobx-react";
import Markdown from "react-native-markdown-display";
import { LightHouseAnimation } from "../../components/light-house/LightHouseAnimation";
import { parseLicenceData } from "./service";

import settingsStore from "../settings/Settings.store";

export const AboutScreen: FunctionComponent = observer(() => {
  const styles = useStyles();
  const data = parseLicenceData();

  const textColor = settingsStore.darkMode ? "white" : "black";

  return (
    <AppLayout title="About this app…">
      <View style={styles.root}>
        <View style={styles.animation}>
          <LightHouseAnimation />
        </View>

        <View style={styles.paragraph}>
          <Markdown style={{ text: { color: textColor } }}>List of **_open source_** dependencies</Markdown>
        </View>

        <FlashList
          data={data}
          renderItem={({ item }) => (
            <List.Item
              title={item.title}
              description={`${item.version} [${item.licenceType} licence]`}
              onPress={() => Linking.openURL(item.repository)}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
          )}
          estimatedItemSize={data.length}
        />
      </View>
    </AppLayout>
  );
});

const useStyles = () => {
  const theme = useTheme() as AppTheme;

  return StyleSheet.create({
    root: {
      flex: 1,
    },
    animation: {
      width: "100%",
      height: 200,
      marginBottom: theme.spacing(2),
    },
    paragraph: {
      textAlign: "center",
      marginVertical: theme.spacing(2),
    },
  });
};
