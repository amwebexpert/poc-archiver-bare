import { useState } from "react";

import { observer } from "mobx-react";
import { useSnackbar } from "../../components/snack-bar/SnackbarProvider";
import { useStyles } from "./CanvasEdit.styles";
import { ExpandableToolbar } from "./components/ExpandableToolbar";
import SvgSnapshot from "./components/SvgViewer/SvgSnapshot";
import { ToolbarAction } from "./components/ToolbarAction";
import paintStore from "./stores/paint.store";

const CanvasEditToolbarBrush = () => {
  const styles = useStyles();
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

  return (
    <>
      <ExpandableToolbar style={[styles.expandableToolbar, { bottom: 40 }]}>
        <ToolbarAction icon="folder-open-outline" onPress={onOpen} />
        <ToolbarAction icon="content-save" onPress={onSave} disabled={isSaveProcessStarted || isSaving} />
        <ToolbarAction icon="undo-variant" onPress={onUndo} disabled={!hasUndoHistory} />
        <ToolbarAction icon="delete-forever" onPress={onDelete} disabled={!hasSelectedElements} />
      </ExpandableToolbar>

      {isSaveProcessStarted && (
        <SvgSnapshot
          elements={elements}
          scale={canvasDimensions.snapshotScale}
          onBase64Generated={onReadyToSaveWithCanvasSnapshot}
        />
      )}
    </>
  );
};

export default observer(CanvasEditToolbarBrush);
