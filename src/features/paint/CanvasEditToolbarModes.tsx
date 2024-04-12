import { observer } from "mobx-react";
import { useStyles } from "./CanvasEdit.styles";
import { ExpandableToolbar } from "./components/ExpandableToolbar";
import { ToolbarAction } from "./components/ToolbarAction";
import { useSelectedElements } from "./hooks/useSelectedElement";
import paintStore from "./stores/paint.store";

const CanvasEditToolbarModes = () => {
  const styles = useStyles();

  const { isCanvasEmpty, isDrawMode, isSelectorMode, isTransformMode, isZoomPanMode } = paintStore;
  const { hasSingleSelectedPath } = useSelectedElements();

  const onDraw = () => paintStore.setCanvasModeToDraw();
  const onSelector = () => paintStore.setCanvasModeToSelector();
  const onTransform = () => paintStore.setCanvasModeToTransform();
  const onZoomPan = () => paintStore.setCanvasModeToZoomPan();

  return (
    <ExpandableToolbar style={[styles.expandableToolbar, { bottom: -8 }]}>
      <ToolbarAction icon="lead-pencil" onPress={onDraw} selected={isDrawMode} />
      <ToolbarAction icon="vector-selection" onPress={onSelector} selected={isSelectorMode} disabled={isCanvasEmpty} />
      <ToolbarAction
        icon="move-resize-variant"
        onPress={onTransform}
        selected={isTransformMode}
        disabled={!hasSingleSelectedPath}
      />
      <ToolbarAction icon="gesture-swipe" onPress={onZoomPan} selected={isZoomPanMode} />
    </ExpandableToolbar>
  );
};

export default observer(CanvasEditToolbarModes);
