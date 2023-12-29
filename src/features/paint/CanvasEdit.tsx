import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import SvgCanvasDrawMode from "./SvgCanvasDrawMode";
import SvgCanvasElementsSelectorMode from "./SvgCanvasElementsSelectorMode";
import SvgCanvasElementsStretcherMode from "./SvgCanvasElementsStretcherMode";
import SvgCanvasZoomMode from "./SvgCanvasZoomMode";
import SvgSnapshot from "./SvgViewer/SvgSnapshot";
import { useCanvasDimensions } from "./hooks/useCanvasDimensions";
import { useSelectedElements } from "./hooks/useSelectedElement";
import paintStore from "./paint.store";
import { IconButton } from "react-native-paper";
import { ExpandableToolbar } from "./components/ExpandableToolbar";

const CanvasEdit = () => {
  const {
    isDrawMode,
    isZoomPanMode,
    isSelectorMode,
    isTransformMode,
    elements,
    hasSelectedElements,
    isCanvasEmpty,
    hasUndoHistory,
  } = paintStore;
  const { hasSingleSelectedPath } = useSelectedElements();
  const { isCanvasDimensionsAvailable, canvasDimensions, onCanvasParentLayoutDimensions } = useCanvasDimensions();
  const [isSaveProcessStarted, setIsSaveProcessStarted] = useState(false);

  useEffect(() => {
    if (isCanvasDimensionsAvailable) {
      paintStore.zoomAndPanInfo.zoomLevel = canvasDimensions!.screenScale;
      // paintStore.reset(elements)
    }
  }, [isCanvasDimensionsAvailable, canvasDimensions]);

  const onDelete = () => {
    if (hasSelectedElements) {
      paintStore.deleteSelectedElements();
    } else {
      paintStore.reset();
    }
  };

  const onReadyToSaveWithCanvasSnapshot = (base64Snapshot = "") => {
    paintStore.save(base64Snapshot);
  };

  return (
    <View style={styles.container} onLayout={e => onCanvasParentLayoutDimensions(e.nativeEvent.layout)}>
      {isCanvasDimensionsAvailable && (
        <View style={[styles.canvasWrapper, canvasDimensions]}>
          {isZoomPanMode && <SvgCanvasZoomMode />}
          {isDrawMode && <SvgCanvasDrawMode />}
          {isSelectorMode && <SvgCanvasElementsSelectorMode />}
          {isTransformMode && <SvgCanvasElementsStretcherMode canvasDimensions={canvasDimensions} />}
        </View>
      )}

      <ExpandableToolbar style={styles.buttonRowTop} fullWidth={400}>
        <IconButton icon="undo" onPress={paintStore.undo} disabled={!hasUndoHistory} />
        <IconButton icon="delete" onPress={onDelete} disabled={isCanvasEmpty} />
        <IconButton icon="grease-pencil" onPress={paintStore.setCanvasModeToDraw} selected={isDrawMode} />
        <IconButton
          icon="vector-selection"
          onPress={paintStore.setCanvasModeToSelector}
          selected={isSelectorMode}
          disabled={isCanvasEmpty}
        />
        <IconButton
          icon="move-resize-variant"
          onPress={paintStore.setCanvasModeToTransform}
          selected={isTransformMode}
          disabled={!hasSingleSelectedPath}
        />
        <IconButton icon="gesture-swipe" onPress={paintStore.setCanvasModeToZoomPan} selected={isZoomPanMode} />
      </ExpandableToolbar>

      {isSaveProcessStarted && (
        <SvgSnapshot
          elements={elements}
          scale={canvasDimensions!.snapshotScale}
          onBase64Generated={onReadyToSaveWithCanvasSnapshot}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    alignContent: "flex-end",
    bottom: 8,
    flexDirection: "row",
    position: "absolute",
    right: 8,
  },
  buttonRowTop: {
    alignContent: "space-between",
    flexDirection: "row",
    justifyContent: "flex-end",
    position: "absolute",
    right: 8,
    top: 8,
  },
  canvasWrapper: {
    backgroundColor: "white",
    borderColor: "lightgray",
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    padding: 0,
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});

export default CanvasEdit;
