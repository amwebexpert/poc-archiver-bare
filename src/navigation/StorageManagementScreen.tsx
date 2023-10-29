import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Paragraph, useTheme } from "react-native-paper";

import { AppLayout } from "../components/layout/AppLayout";
import { AppTheme } from "../theme";
import { RootStackParamList } from "./AppNavigation";

const StorageManagementScreen = () => {
  const styles = useStyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <AppLayout title="Storage Management">
      <View style={styles.root}>
        <ScrollView style={styles.features}>
          <Paragraph style={styles.paragraph}>Device storage features</Paragraph>

          <Button
            mode="outlined"
            style={styles.category}
            onPress={() => navigation.navigate("SettingsScreen")}
            icon="cog">
            Settings MobX store
          </Button>

          <Button
            mode="outlined"
            style={styles.category}
            onPress={() => navigation.navigate("StoreDemoScreen")}
            icon="database">
            Users MobX store
          </Button>
        </ScrollView>
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
    paragraph: {
      marginVertical: theme.spacing(2),
    },
    features: {
      marginTop: theme.spacing(2),
    },
    category: {
      marginVertical: theme.spacing(2),
    },
  });
};

export default StorageManagementScreen;
