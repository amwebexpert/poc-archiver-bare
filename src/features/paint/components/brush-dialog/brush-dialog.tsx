import React, { type FunctionComponent } from "react";
import { View } from "react-native";
import { Button, Dialog, Text } from "react-native-paper";

interface IProps {
  onDismiss: () => void;
}

export const BrushDialog: FunctionComponent<IProps> = ({ onDismiss }) => {
  return (
    <Dialog visible={true} onDismiss={onDismiss}>
      <Dialog.Title>This is a title</Dialog.Title>

      <Dialog.Content>
        <Text variant="bodyMedium">This is simple dialog</Text>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onPress={onDismiss}>Cancel</Button>
        <Button onPress={onDismiss}>OK</Button>
      </Dialog.Actions>
    </Dialog>
  );
};
