import { FunctionComponent, useState } from "react";

import Clipboard from "@react-native-clipboard/clipboard";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

import { AppLayout } from "../../components/layout/AppLayout";
import { AppTheme } from "../../theme";

const ClipboardScreen: FunctionComponent = () => {
  const styles = useStyles();
  const [copiedText, setCopiedText] = useState("");

  const cut = () => {
    Clipboard.setString(copiedText);
    setCopiedText("");
  };

  const copy = () => Clipboard.setString(copiedText);

  const paste = async () => Clipboard.getString().then(setCopiedText);

  return (
    <AppLayout title="Clipboard screen">
      <View style={styles.root}>
        <Text>Copy & Paste into text area</Text>
        <View style={styles.input}>
          <TextInput
            value={copiedText}
            style={{ flex: 1 }}
            label="Text"
            placeholder="Type some text here"
            multiline={true}
            onChangeText={setCopiedText}
          />
        </View>

        <View style={styles.actions}>
          <Button icon="content-copy" mode="outlined" onPress={copy}>
            Copy
          </Button>
          <Button icon="content-cut" mode="outlined" onPress={cut}>
            Cut
          </Button>
          <Button icon="clipboard" mode="outlined" onPress={paste}>
            Paste
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
      backgroundColor: theme.colors.background,
    },
    input: {
      flex: 1,
      width: "100%",
      marginBottom: theme.spacing(2),
    },
    actions: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
    },
  });
};

export default ClipboardScreen;
