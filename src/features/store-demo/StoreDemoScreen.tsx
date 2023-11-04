import { FunctionComponent } from "react";
import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react";
import { StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

import { AppLayout } from "../../components/layout/AppLayout";
import { AppTheme } from "../../theme";
import observableUsersStore from "./Users.store";

const StoreDemoScreen: FunctionComponent = () => {
  const styles = useStyles();
  const navigation = useNavigation();

  return (
    <AppLayout title="Settings screen">
      <View style={styles.root}>
        <Text>{`Users count: ${observableUsersStore.usersCount}`}</Text>

        <View style={styles.storeData}>
          {observableUsersStore.usersLoadCompleted && (
            <Text>{JSON.stringify(observableUsersStore.users, null, 2)}</Text>
          )}
        </View>

        <Button icon="download" mode="outlined" onPress={() => observableUsersStore.loadUsers()}>
          Load users
        </Button>

        <Button icon="delete" mode="outlined" onPress={() => observableUsersStore.resetUsers()}>
          Reset
        </Button>
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
