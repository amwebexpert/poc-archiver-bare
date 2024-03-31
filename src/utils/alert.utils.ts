import { Alert } from "react-native";

export const askConfirmation = async (question: string) =>
  new Promise(resolve => {
    Alert.alert("Confirmation", question, [
      {
        text: "Cancel",
        onPress: () => resolve(false),
        style: "cancel",
      },
      { text: "OK", onPress: () => resolve(true) },
    ]);
  });
