import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { observer } from "mobx-react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { IconButton, useTheme } from "react-native-paper";
import { AppTheme } from "../../theme";
import SvgCanvasDrawMode from "./SvgCanvasDrawMode";
import SvgCanvasElementsSelectorMode from "./SvgCanvasElementsSelectorMode";
import SvgCanvasElementsStretcherMode from "./SvgCanvasElementsStretcherMode";
import SvgCanvasZoomMode from "./SvgCanvasZoomMode";
import SvgSnapshot from "./components/SvgViewer/SvgSnapshot";
import { ExpandableToolbar } from "./components/ExpandableToolbar";
import { useCanvasDimensions } from "./hooks/useCanvasDimensions";
import { useSelectedElements } from "./hooks/useSelectedElement";
import paintStore from "./stores/paint.store";
import { SvgElement } from "./types/svg.types";
import { ToolbarAction } from "./components/ToolbarAction";

const CanvasEdit = () => {
  const styles = useStyles();
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
      const { screenScale } = canvasDimensions!;
      console.info("canvasDimensions!.screenScale", screenScale);

      // TODO when loading existing XML file content
      // const elements = fromSvgFormat({ content: svgXmlContent, screenScale });
      const elements: SvgElement[] = [];
      paintStore.reset(elements);
    }
  }, [isCanvasDimensionsAvailable, canvasDimensions]);

  const onReadyToSaveWithCanvasSnapshot = (base64Snapshot = "") => {
    paintStore.save(base64Snapshot);
    setIsSaveProcessStarted(false);
  };

  const onSave = () => setIsSaveProcessStarted(true);
  const onUndo = () => paintStore.undo();
  const onDelete = () => paintStore.deleteSelectedElements();
  const onDraw = () => paintStore.setCanvasModeToDraw();
  const onSelector = () => paintStore.setCanvasModeToSelector();
  const onTransform = () => paintStore.setCanvasModeToTransform();
  const onZoomPan = () => paintStore.setCanvasModeToZoomPan();

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container} onLayout={e => onCanvasParentLayoutDimensions(e.nativeEvent.layout)}>
        {isCanvasDimensionsAvailable && (
          <View style={[styles.canvasWrapper, canvasDimensions]}>
            {isZoomPanMode && <SvgCanvasZoomMode />}
            {isDrawMode && <SvgCanvasDrawMode />}
            {isSelectorMode && <SvgCanvasElementsSelectorMode />}
            {isTransformMode && <SvgCanvasElementsStretcherMode canvasDimensions={canvasDimensions} />}
          </View>
        )}

        <ExpandableToolbar style={styles.expandableToolbar} fullWidth={368}>
          <ToolbarAction icon="folder-open-outline" onPress={onSave} />
          <ToolbarAction icon="content-save" onPress={onSave} disabled={!hasUndoHistory} />
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
            scale={canvasDimensions!.snapshotScale}
            onBase64Generated={onReadyToSaveWithCanvasSnapshot}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const useStyles = () => {
  const theme = useTheme() as AppTheme;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    expandableToolbar: {
      backgroundColor: "black",
      flexDirection: "row",
      justifyContent: "flex-end",
      position: "absolute",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "green",
      borderRadius: 4,
      right: 0,
      bottom: -8,
    },
    canvasWrapper: {
      backgroundColor: "white",
      borderColor: "lightgray",
      borderWidth: StyleSheet.hairlineWidth,
      overflow: "hidden",
      padding: 0,
    },
  });
};

export default observer(CanvasEdit);
