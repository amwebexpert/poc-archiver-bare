import { FunctionComponent, useEffect } from "react";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { observer } from "mobx-react";
import SvgViewer from "./components/SvgViewer/SvgViewer";
import { PathGestureDrawer } from "./components/PathGestureDrawer";
import { DEFAULT_STROKE_WIDTH } from "./constants";
import paintStore from "./stores/paint.store";
import { paintCommonStyles } from "./paint.styles";
import { createElementFromPathGesture } from "./utils/canvas.utils";

const SvgCanvasDrawMode: FunctionComponent<{}> = () => {
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
    const newElement = createElementFromPathGesture({ d, strokeColor: "black", strokeWidth: DEFAULT_STROKE_WIDTH });
    paintStore.addDrawElement(newElement);
  };

  return (
    <View style={[paintCommonStyles.container, { transform: [{ scale: zoomLevel }, { translateX }, { translateY }] }]}>
      <PathGestureDrawer
        gesturePoints={gesturePoints}
        strokeColor="black"
        strokeWidth={3}
        addElementFromGesture={addElementFromGesture}
      />

      <SvgViewer elements={elements} />
    </View>
  );
};

export default observer(SvgCanvasDrawMode);
