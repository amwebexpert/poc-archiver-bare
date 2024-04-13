import { observer } from "mobx-react";
import { useStyles } from "../CanvasEdit.styles";
import { ExpandableToolbar } from "./ExpandableToolbar";
import { ToolbarAction } from "./ToolbarAction";
import { useSelectedElements } from "../hooks/useSelectedElement";
import paintStore from "../stores/paint.store";

const ToolbarModes = () => {
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

export default observer(ToolbarModes);
