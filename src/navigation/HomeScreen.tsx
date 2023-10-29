import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Linking, ScrollView, StyleSheet, View } from "react-native";
import { Button, Paragraph, Text, useTheme } from "react-native-paper";

import { AppLayout } from "../components/layout/AppLayout";
import { AppTheme } from "../theme";

import { APP_URL } from "./HomeScreen.constants";
import { RootStackParamList } from "./MainNavigation";

export const HomeScreen = () => {
  const styles = useStyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <AppLayout title="Home">
      <ScrollView>
        <View style={styles.root}>
          <Text variant="headlineMedium" style={styles.heading}>
            ReactNative demos
          </Text>

          <Paragraph style={styles.paragraph}>
            Enjoy this proof of concepts collection for React Native app development
          </Paragraph>

          <Paragraph style={styles.paragraph}>
            Stay tuned because this is also an evolutive app used as a sandbox to learn by implementing real solutions
            to real problems.
          </Paragraph>
        </View>

        <Button
          mode="outlined"
          style={styles.category}
          onPress={() => navigation.navigate("StorageManagementScreen")}
          icon="database">
          Storage management…
        </Button>

        <Button mode="outlined" style={styles.category} onPress={() => navigation.navigate("OtherDemos")} icon="brain">
          Miscellaneous…
        </Button>
      </ScrollView>

      <View>
        <Paragraph style={styles.paragraphCentered}>Like it? Do not forget to star the repo!</Paragraph>

        <View style={styles.actions}>
          <Button mode="outlined" onPress={() => Linking.openURL(APP_URL)} icon="star">
            Star it!
          </Button>

          <Button mode="outlined" onPress={() => navigation.navigate("About")} icon="book-information-variant">
            Licences…
          </Button>
        </View>
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
      marginHorizontal: theme.spacing(2),
    },
    heading: {
      marginVertical: theme.spacing(2),
    },
    paragraph: {
      marginVertical: theme.spacing(1),
    },
    paragraphCentered: {
      marginVertical: theme.spacing(1),
      textAlign: "center",
    },
    actions: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    category: {
      justifyContent: "center",
      marginVertical: theme.spacing(1),
    },
  });
};
