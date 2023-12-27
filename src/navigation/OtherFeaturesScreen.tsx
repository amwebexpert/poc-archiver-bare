import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { observer } from "mobx-react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Paragraph, useTheme } from "react-native-paper";

import { AppLayout } from "../components/layout/AppLayout";
import { AppTheme } from "../theme";

import { AppScreens, RootStackParamList } from "./AppNavigation";

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
            onPress={() => navigation.navigate(AppScreens.JailMonkeyScreen)}
            icon="login">
            Jail broken detect
          </Button>

          <Button
            mode="outlined"
            style={styles.category}
            onPress={() => navigation.navigate(AppScreens.DeviceInfoScreen)}
            icon="information-outline">
            Device info
          </Button>

          <Button
            style={styles.category}
            icon="network"
            mode="outlined"
            compact={true}
            onPress={() => navigation.navigate(AppScreens.NetworkLoggerScreen)}>
            Network trafic
          </Button>

          <Button
            style={styles.category}
            icon="wifi"
            mode="outlined"
            compact={true}
            onPress={() => navigation.navigate(AppScreens.NetInfoScreen)}>
            Network Info
          </Button>

          <Button
            style={styles.category}
            icon="snail"
            mode="outlined"
            compact={true}
            onPress={() => navigation.navigate(AppScreens.StyledComponentsScreen)}>
            Styled components
          </Button>

          <Button
            style={styles.category}
            icon="clipboard"
            mode="outlined"
            compact={true}
            onPress={() => navigation.navigate(AppScreens.ClipboardScreen)}>
            Clipboard
          </Button>

          <Button
            style={styles.category}
            icon="calendar"
            mode="outlined"
            compact={true}
            onPress={() => navigation.navigate(AppScreens.DatePickerScreen)}>
            Date & time picker
          </Button>

          <Button
            style={styles.category}
            icon="email"
            mode="outlined"
            compact={true}
            onPress={() => navigation.navigate(AppScreens.EmailerScreen)}>
            Emailer
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
      marginVertical: theme.spacing(1),
    },
  });
};

export default observer(OtherFeaturesScreen);
