import { FlashList } from "@shopify/flash-list";
import { Linking, StyleSheet, View } from "react-native";
import { List, Paragraph, useTheme } from "react-native-paper";

import { AppLayout } from "../../components/layout/AppLayout";
import { AppTheme } from "../../theme";

import { parseLicenceData } from "./service";

export const AboutScreen = (): JSX.Element => {
  const styles = useStyles();
  const data = parseLicenceData();

  return (
    <AppLayout title="About this app…">
      <View style={styles.root}>
        <Paragraph style={styles.paragraph}>List of open source dependencies</Paragraph>

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
};

const useStyles = () => {
  const theme = useTheme() as AppTheme;

  return StyleSheet.create({
    root: {
      flex: 1,
    },
    paragraph: {
      textAlign: "center",
      marginVertical: theme.spacing(2),
    },
  });
};
