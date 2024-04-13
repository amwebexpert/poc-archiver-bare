import React, { useState, type FunctionComponent } from "react";
import { Button, Dialog } from "react-native-paper";
import ColorPicker from "react-native-wheel-color-picker";

import { useStyles } from "./brush-dialog.styles";
import brushStore from "../../stores/brush.store";
import paintStore from "../../stores/paint.store";

interface IProps {
  onDismiss: () => void;
}

export const BrushDialog: FunctionComponent<IProps> = ({ onDismiss }) => {
  const styles = useStyles();

  const [selectedColor, setSelectedColor] = useState(brushStore.color);

  const onOK = () => {
    paintStore.isDrawGestureDirty = true;
    brushStore.color = selectedColor;
    onDismiss();
  };

  return (
    <Dialog visible={true} onDismiss={onDismiss}>
      <Dialog.Content style={styles.colorPicker}>
        <ColorPicker
          color={brushStore.color}
          onColorChangeComplete={setSelectedColor}
          thumbSize={30}
          sliderSize={30}
          noSnap={true}
          row={false}
        />
      </Dialog.Content>

      <Dialog.Actions>
        <Button onPress={onDismiss}>Cancel</Button>
        <Button mode="contained" onPress={onOK}>
          OK
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};
