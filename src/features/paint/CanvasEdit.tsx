import { useState } from "react";
import { View } from "react-native";

import { observer } from "mobx-react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SvgCanvasDrawMode from "./SvgCanvasDrawMode";
import SvgCanvasElementsSelectorMode from "./SvgCanvasElementsSelectorMode";
import SvgCanvasElementsStretcherMode from "./SvgCanvasElementsStretcherMode";
import SvgCanvasZoomMode from "./SvgCanvasZoomMode";
import SvgSnapshot from "./components/SvgViewer/SvgSnapshot";
import { ExpandableToolbar } from "./components/ExpandableToolbar";
import { useSelectedElements } from "./hooks/useSelectedElement";
import paintStore from "./stores/paint.store";
import { ToolbarAction } from "./components/ToolbarAction";
import { useSnackbar } from "../../components/snack-bar/SnackbarProvider";
import { useStyles } from "./CanvasEdit.styles";

const CanvasEdit = () => {
  const styles = useStyles();
  const { showSnackbarMessage } = useSnackbar();
  const {
    canvasDimensions,
    elements,
    hasSelectedElements,
    hasUndoHistory,
    isCanvasDimensionsAvailable,
    isCanvasEmpty,
    isDrawMode,
    isSaving,
    isSelectorMode,
    isTransformMode,
    isZoomPanMode,
    paintFilename,
  } = paintStore;

  const { hasSingleSelectedPath } = useSelectedElements();

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
  const onDraw = () => paintStore.setCanvasModeToDraw();
  const onSelector = () => paintStore.setCanvasModeToSelector();
  const onTransform = () => paintStore.setCanvasModeToTransform();
  const onZoomPan = () => paintStore.setCanvasModeToZoomPan();

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container} onLayout={e => paintStore.onCanvasParentLayoutDimensions(e.nativeEvent.layout)}>
        {isCanvasDimensionsAvailable && (
          <View style={[styles.canvasWrapper, canvasDimensions]}>
            {isZoomPanMode && <SvgCanvasZoomMode />}
            {isDrawMode && <SvgCanvasDrawMode />}
            {isSelectorMode && <SvgCanvasElementsSelectorMode />}
            {isTransformMode && <SvgCanvasElementsStretcherMode canvasDimensions={canvasDimensions} />}
          </View>
        )}

        <ExpandableToolbar style={styles.expandableToolbar}>
          <ToolbarAction icon="folder-open-outline" onPress={onOpen} />
          <ToolbarAction icon="content-save" onPress={onSave} disabled={isSaveProcessStarted || isSaving} />
          <ToolbarAction icon="undo-variant" onPress={onUndo} disabled={!hasUndoHistory} />
          <ToolbarAction icon="delete-forever" onPress={onDelete} disabled={!hasSelectedElements} />
          <ToolbarAction icon="lead-pencil" onPress={onDraw} selected={isDrawMode} />
          <ToolbarAction
            icon="vector-selection"
            onPress={onSelector}
            selected={isSelectorMode}
            disabled={isCanvasEmpty}
          />
          <ToolbarAction
            icon="move-resize-variant"
            onPress={onTransform}
            selected={isTransformMode}
            disabled={!hasSingleSelectedPath}
          />
          <ToolbarAction icon="gesture-swipe" onPress={onZoomPan} selected={isZoomPanMode} />
        </ExpandableToolbar>

        {isSaveProcessStarted && (
          <SvgSnapshot
            elements={elements}
            scale={canvasDimensions.snapshotScale}
            onBase64Generated={onReadyToSaveWithCanvasSnapshot}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default observer(CanvasEdit);
