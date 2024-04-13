import { View } from "react-native";

import { observer } from "mobx-react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useStyles } from "./CanvasEdit.styles";
import ToolbarBrush from "./components/ToolbarBrush";
import ToolbarModes from "./components/ToolbarModes";
import SvgCanvasDrawMode from "./SvgCanvasDrawMode";
import SvgCanvasElementsSelectorMode from "./SvgCanvasElementsSelectorMode";
import SvgCanvasElementsStretcherMode from "./SvgCanvasElementsStretcherMode";
import SvgCanvasZoomMode from "./SvgCanvasZoomMode";
import paintStore from "./stores/paint.store";

const CanvasEdit = () => {
  const styles = useStyles();

  const { canvasDimensions, isCanvasDimensionsAvailable, isDrawMode, isSelectorMode, isTransformMode, isZoomPanMode } =
    paintStore;

  return (
    <>
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
        </View>
      </GestureHandlerRootView>

      <ToolbarModes />
      <ToolbarBrush />
    </>
  );
};

export default observer(CanvasEdit);
