import { FunctionComponent, useState } from "react";

import { observer } from "mobx-react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

import { openComposer, openInbox } from "react-native-email-link";
import { AppLayout } from "../../components/layout/AppLayout";
import { AppTheme } from "../../theme";

const EmailerScreen: FunctionComponent = () => {
  const styles = useStyles();
  const [to, setTo] = useState("amwebexpert@gmail.com");
  const [subject, setSubject] = useState("Test subject");
  const [body, setBody] = useState("Test body");

  return (
    <AppLayout title="Settings screen">
      <View style={styles.root}>
        <Text variant="headlineSmall" style={styles.title}>
          Compose email
        </Text>

        <View style={styles.input}>
          <TextInput value={to} label="To" placeholder="To" onChangeText={setTo} />
          <TextInput value={subject} label="Subject" placeholder="Enter the subject" onChangeText={setSubject} />
          <TextInput
            value={body}
            label="Body"
            placeholder="Enter your email content here"
            onChangeText={setBody}
            multiline={true}
            numberOfLines={10}
          />
        </View>

        <View style={styles.actions}>
          <Button icon="email" mode="outlined" onPress={() => openInbox({ title: "Demo: please pick an emailer app" })}>
            Inbox
          </Button>
          <Button icon="send" mode="outlined" onPress={() => openComposer({ to, subject, body })}>
            Send
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
      justifyContent: "center",
    },
    title: {
      marginBottom: theme.spacing(3),
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

export default observer(EmailerScreen);
