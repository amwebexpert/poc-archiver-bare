import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Paragraph, useTheme } from "react-native-paper";

import { AppLayout } from "../components/layout/AppLayout";
import { AppTheme } from "../theme";
import { RootStackParamList } from "./MainNavigation";

const OtherFeaturesScreen = () => {
  const styles = useStyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <AppLayout title="Miscellaneous">
      <View style={styles.root}>
        <Paragraph style={styles.paragraph}>Other features</Paragraph>

        <ScrollView style={styles.features}>
          <Button
            mode="outlined"
            style={styles.category}
            onPress={() => navigation.navigate("JailMonkeyScreen")}
            icon="login">
            Jail broken detect
          </Button>

          <Button
            mode="outlined"
            style={styles.category}
            onPress={() => navigation.navigate("DeviceInfoScreen")}
            icon="information-outline">
            Device info
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

export default OtherFeaturesScreen;
