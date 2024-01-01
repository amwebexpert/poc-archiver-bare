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

  const onDelete = () => {
    if (hasSelectedElements) {
      paintStore.deleteSelectedElements();
    } else {
      paintStore.reset();
    }
  };

  const onReadyToSaveWithCanvasSnapshot = (base64Snapshot = "") => {
    paintStore.save(base64Snapshot);
    setIsSaveProcessStarted(false);
  };

  const onUndo = () => paintStore.undo();
  const onDraw = () => paintStore.setCanvasModeToDraw();
  const onSelector = () => paintStore.setCanvasModeToSelector();
  const onTransform = () => paintStore.setCanvasModeToTransform();
  const onZoomPan = () => paintStore.setCanvasModeToZoomPan();

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.container} onLayout={e => onCanvasParentLayoutDimensions(e.nativeEvent.layout)}>
        {isCanvasDimensionsAvailable && (
          <View style={[styles.canvasWrapper, canvasDimensions]}>
            {isZoomPanMode && <SvgCanvasZoomMode />}
            {isDrawMode && <SvgCanvasDrawMode />}
            {isSelectorMode && <SvgCanvasElementsSelectorMode />}
            {isTransformMode && <SvgCanvasElementsStretcherMode canvasDimensions={canvasDimensions} />}
          </View>
        )}

        <ExpandableToolbar style={styles.expandableToolbar} fullWidth={308}>
          <IconButton mode="contained" icon="undo" onPress={onUndo} disabled={!hasUndoHistory} />
          <IconButton mode="contained" icon="delete" onPress={onDelete} disabled={isCanvasEmpty} />
          <IconButton mode="contained" icon="grease-pencil" onPress={onDraw} selected={isDrawMode} />
          <IconButton
            mode="contained"
            icon="vector-selection"
            onPress={onSelector}
            selected={isSelectorMode}
            disabled={isCanvasEmpty}
          />
          <IconButton
            mode="contained"
            icon="move-resize-variant"
            onPress={onTransform}
            selected={isTransformMode}
            disabled={!hasSingleSelectedPath}
          />
          <IconButton mode="contained" icon="gesture-swipe" onPress={onZoomPan} selected={isZoomPanMode} />
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
    root: {
      flex: 1,
    },
    buttonRow: {
      alignContent: "flex-end",
      bottom: theme.spacing(1),
      flexDirection: "row",
      position: "absolute",
      right: theme.spacing(1),
    },
    expandableToolbar: {
      alignContent: "space-between",
      backgroundColor: "black",
      flexDirection: "row",
      justifyContent: "flex-end",
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
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
};

export default observer(CanvasEdit);
