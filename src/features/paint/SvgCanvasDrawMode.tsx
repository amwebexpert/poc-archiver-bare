import { FunctionComponent, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import paintStore from "./paint.store";
import SvgViewer from "./SvgViewer/SvgViewer";
import { PathGestureDrawer } from "./components/PathGestureDrawer";
import { DEFAULT_STROKE_WIDTH } from "./constants";
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
    <View style={[styles.container, { transform: [{ scale: zoomLevel }, { translateX }, { translateY }] }]}>
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

const styles = StyleSheet.create({
  container: {
    borderColor: "black",
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
  },
});

export default SvgCanvasDrawMode;
