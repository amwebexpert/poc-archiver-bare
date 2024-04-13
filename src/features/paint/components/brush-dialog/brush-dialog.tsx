import React, { useRef, type FunctionComponent } from "react";
import { Button, Dialog } from "react-native-paper";
import ColorPicker from "react-native-wheel-color-picker";

import { useStyles } from "./brush-dialog.styles";
import brushStore from "../../stores/brush.store";

interface IProps {
  onDismiss: () => void;
}

export const BrushDialog: FunctionComponent<IProps> = ({ onDismiss }) => {
  const colorPickerRef = useRef(null);
  const { color } = brushStore;

  const styles = useStyles();

  const onColorChange = (color: string) => console.log("Color selected:", color);

  return (
    <Dialog visible={true} onDismiss={onDismiss}>
      <Dialog.Title>This is a title</Dialog.Title>

      <Dialog.Content style={styles.colorPicker}>
        <ColorPicker
          color={color}
          onColorChange={(color: string) => onColorChange(color)}
          onColorChangeComplete={(color: string) => console.info(`onColorChangeComplete: ${color}`)}
          thumbSize={30}
          sliderSize={30}
          noSnap={true}
          row={false}
        />
      </Dialog.Content>

      <Dialog.Actions>
        <Button onPress={onDismiss}>Cancel</Button>
        <Button onPress={onDismiss}>OK</Button>
      </Dialog.Actions>
    </Dialog>
  );
};
