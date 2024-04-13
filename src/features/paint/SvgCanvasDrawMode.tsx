import { FunctionComponent, useEffect } from "react";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { observer } from "mobx-react";
import { paintCommonStyles } from "./CanvasEdit.styles";
import { PathGestureDrawer } from "./components/PathGestureDrawer";
import SvgViewer from "./components/SvgViewer/SvgViewer";
import brushStore from "./stores/brush.store";
import paintStore from "./stores/paint.store";
import { createElementFromPathGesture } from "./utils/canvas.utils";

const SvgCanvasDrawMode: FunctionComponent<{}> = () => {
  const { size, color } = brushStore;
  const { elements, zoomAndPanInfo, isDrawGestureDirty } = paintStore;
  const { zoomLevel, translateX, translateY } = zoomAndPanInfo;
  const gesturePoints = useSharedValue<string[]>([]);

  useEffect(() => {
    if (isDrawGestureDirty) {
      if (gesturePoints.value.length > 0) {
        gesturePoints.value = [];
      }
      paintStore.isDrawGestureDirty = false;
    }
  }, [isDrawGestureDirty]);

  const addElementFromGesture = (d = "") => {
    const newElement = createElementFromPathGesture({ d, strokeColor: color, strokeWidth: size });
    paintStore.addDrawElement(newElement);
  };

  return (
    <View style={[paintCommonStyles.container, { transform: [{ scale: zoomLevel }, { translateX }, { translateY }] }]}>
      <PathGestureDrawer
        gesturePoints={gesturePoints}
        strokeColor={color}
        strokeWidth={size}
        addElementFromGesture={addElementFromGesture}
      />

      <SvgViewer elements={elements} />
    </View>
  );
};

export default observer(SvgCanvasDrawMode);
