import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Paragraph, useTheme } from "react-native-paper";

import { AppLayout } from "../components/layout/AppLayout";
import { AppTheme } from "../theme";
import { AppScreens, RootStackParamList } from "./AppNavigation";

const AnimationFeaturesScreen = () => {
  const styles = useStyles();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <AppLayout title="Animations">
      <View style={styles.root}>
        <ScrollView style={styles.features}>
          <Paragraph style={styles.paragraph}>Animations related features</Paragraph>

          <Button
            mode="outlined"
            style={styles.category}
            onPress={() => navigation.navigate(AppScreens.SettingsScreen)}
            icon="paint">
            Paint demo…
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
      textAlign: "center",
    },
    features: {
      marginTop: theme.spacing(2),
    },
    category: {
      marginVertical: theme.spacing(2),
    },
  });
};

export default AnimationFeaturesScreen;
