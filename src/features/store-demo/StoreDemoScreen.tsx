import { FunctionComponent } from "react";
import { observer } from "mobx-react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text, TextInput, useTheme } from "react-native-paper";

import { AppLayout } from "../../components/layout/AppLayout";
import { AppTheme } from "../../theme";
import usersStore from "./Users.store";
import { useUserLoggerWithDirectStoreUsage } from "./useUserLoggerWithDirectStoreUsage";

const StoreDemoScreen: FunctionComponent = () => {
  const styles = useStyles();

  console.info(`====>>> re-rendering StoreDemoScreen. Users count: ${usersStore.users.length}`);
  //useUserLogger(usersStore.users);
  // useCounterWithDirectStoreUsage();
  useUserLoggerWithDirectStoreUsage();

  return (
    <AppLayout title="Settings screen">
      <View style={styles.root}>
        <View style={styles.activity}>
          {usersStore.isLoading ? <ActivityIndicator /> : <Text>{`Users count: ${usersStore.usersCount}`}</Text>}
        </View>

        <View style={styles.storeData}>
          {usersStore.usersLoadCompleted && (
            <TextInput multiline={true}>{JSON.stringify(usersStore.users, null, 2)}</TextInput>
          )}
        </View>

        <Button icon="download" mode="outlined" onPress={() => usersStore.loadUsers()}>
          Fetch users
        </Button>

        <Button icon="broom" mode="outlined" onPress={() => usersStore.resetUsers()}>
          Reset
        </Button>
      </View>
    </AppLayout>
  );
};

const useStyles = () => {
  const theme = useTheme() as AppTheme;

  return StyleSheet.create({
    activity: {
      height: 28,
    },
    root: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    storeData: {
      flex: 1,
      width: "100%",
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
  });
};

export default observer(StoreDemoScreen);
