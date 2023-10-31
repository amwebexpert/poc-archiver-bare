import JailMonkey from "jail-monkey";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Button, Text, useTheme } from "react-native-paper";

import { AppLayout } from "../../components/layout/AppLayout";
import { AppTheme } from "../../theme";

export const JailMonkeyScreen = (): JSX.Element => {
  const styles = useStyles();
  const navigation = useNavigation();

  const [isDevelopmentSettingsMode, setIsDevelopmentSettingsMode] = useState(false);
  const [isDebuggedMode, setIsDebuggedMode] = useState(false);

  useEffect(() => {
    JailMonkey.isDevelopmentSettingsMode().then(setIsDevelopmentSettingsMode).catch(console.warn);
  }, []);

  useEffect(() => {
    JailMonkey.isDebuggedMode().then(setIsDebuggedMode).catch(console.warn);
  }, []);

  return (
    <AppLayout title="Settings screen">
      <View style={styles.root}>
        <ScrollView style={styles.content} accessible={false} accessibilityLabel="">
          <Text style={styles.title} variant="headlineSmall">
            All Platforms
          </Text>

          <Row label="isJailBroken" value={JailMonkey.isJailBroken()} />
          <Row label="canMockLocation" value={JailMonkey.canMockLocation()} />
          <Row label="trustFall" value={JailMonkey.trustFall()} />
          <Row label="isDebuggedMode" value={isDebuggedMode} />

          <Text style={styles.title} variant="headlineSmall">
            Android
          </Text>
          <Text style={styles.note}>These APIs will always return false on iOS.</Text>
          <Row label="hookDetected" value={JailMonkey.hookDetected()} />
          <Row label="isOnExternalStorage" value={JailMonkey.isOnExternalStorage()} />
          <Row label="AdbEnabled" value={JailMonkey.AdbEnabled()} />
          <Row label="isDevelopmentSettingsMode" value={isDevelopmentSettingsMode} />
        </ScrollView>

        <Button icon="arrow-left" mode="outlined" onPress={() => navigation.goBack()}>
          Back
        </Button>
      </View>
    </AppLayout>
  );
};

const Row = ({ label, value }: { label: string; value: any }) => {
  const styles = useStyles();

  return (
    <View style={styles.row} accessibilityLabel={`${label}: ${value?.toString() ?? "unknown"}`}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value?.toString() ?? "unknown"}</Text>
    </View>
  );
};

const useStyles = () => {
  const theme = useTheme() as AppTheme;

  return StyleSheet.create({
    root: {
      flex: 1,
      alignItems: "center",
    },
    content: {
      flex: 1,
      padding: 20,
    },
    title: {
      marginTop: 20,
      marginBottom: 5,
    },
    note: {
      marginBottom: 10,
    },
    row: {
      flexDirection: "row",
      marginBottom: 5,
    },
    label: {
      marginRight: 5,
    },
    value: {
      fontWeight: "bold",
    },
  });
};
