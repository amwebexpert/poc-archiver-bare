import { useEffect, useState } from "react";

import { observer } from "mobx-react";
import { useSnackbar } from "../../../components/snack-bar/SnackbarProvider";
import { useStyles } from "../CanvasEdit.styles";
import { ExpandableToolbar } from "./ExpandableToolbar";
import SvgSnapshot from "./SvgViewer/SvgSnapshot";
import { ToolbarAction } from "./ToolbarAction";
import paintStore from "../stores/paint.store";
import { useModalToggler } from "../../../hooks/use-modal-toggler";
import { BrushDialog } from "./brush-dialog/brush-dialog";
import brushStore from "../stores/brush.store";

const ToolbarBrush = () => {
  const styles = useStyles();
  const [isBrushModalVisible, hideBrushModal, showBrushModal] = useModalToggler();
  const { showSnackbarMessage } = useSnackbar();
  const { canvasDimensions, elements, hasSelectedElements, hasUndoHistory, isSaving, paintFilename } = paintStore;

  const [isSaveProcessStarted, setIsSaveProcessStarted] = useState(false);

  const onReadyToSaveWithCanvasSnapshot = (base64Snapshot = "") => {
    setIsSaveProcessStarted(false);
    paintStore.save(base64Snapshot).then(isSuccess => {
      if (isSuccess) showSnackbarMessage(`Saved ${paintFilename}`);
    });
  };

  const onOpen = () => paintStore.open();
  const onSave = () => setIsSaveProcessStarted(true);
  const onUndo = () => paintStore.undo();
  const onDelete = () => paintStore.deleteSelectedElements();
  const onGenerate = () => paintStore.generateSvg();

  useEffect(() => {
    if (isSaveProcessStarted) {
      showSnackbarMessage("Saving...", 1000);
    }
  }, [isSaveProcessStarted]);

  return (
    <>
      <ExpandableToolbar style={[styles.expandableToolbar, { bottom: 40 }]}>
        <ToolbarAction icon="folder-open-outline" onPress={onOpen} />
        <ToolbarAction icon="content-save" onPress={onSave} disabled={isSaveProcessStarted || isSaving} />
        <ToolbarAction icon="undo-variant" onPress={onUndo} disabled={!hasUndoHistory} />
        <ToolbarAction icon="delete-forever" onPress={onDelete} disabled={!hasSelectedElements} />
        <ToolbarAction icon="invert-colors" containerColor={brushStore.color} onPress={showBrushModal} />
        <ToolbarAction icon="robot-excited-outline" onPress={onGenerate} />
      </ExpandableToolbar>

      {isSaveProcessStarted && (
        <SvgSnapshot
          elements={elements}
          scale={canvasDimensions.snapshotScale}
          onBase64Generated={onReadyToSaveWithCanvasSnapshot}
        />
      )}

      {isBrushModalVisible && <BrushDialog onDismiss={hideBrushModal} />}
    </>
  );
};

export default observer(ToolbarBrush);
