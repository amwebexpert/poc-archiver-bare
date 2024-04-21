import { FunctionComponent, useEffect } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import { ZERO_BOUNDING_BOX } from "../../../constants";
import { fromCoordinatesArray, toCoordinatesArray } from "../../../utils/svg-path.utils";

import paintStore from "../../../stores/paint.store";
import { SvgPathElement } from "../../../types/svg.types";
import { MovableHandle } from "../MovableHandle";
import { SelectorMoveType } from "../constants";
import {
  applyBottomRightSnap,
  applyTopLeftSnap,
  onBottomRightDrag,
  onRegionDrag,
  onTopLeftDrag,
  setupRegionContext,
} from "../selectorUtils";
import { AnimatedPath, AnimatedSvg, AnimatedView } from "./selector.constants";
import { styles } from "./selector.styles";
import { SelectorProps } from "./selector.types";

export const PathSelector: FunctionComponent<SelectorProps> = ({
  originalBoundingBox = ZERO_BOUNDING_BOX,
  selectedElement,
  onDrawElementUpdate = () => {},
}) => {
  const zoomLevel = paintStore.zoomAndPanInfo.zoomLevel;
  const { width: MAX_X, height: MAX_Y } = paintStore.canvasDimensions;
  const context = useSharedValue<Record<string, any>>({});

  const isSelectionAreaDirty = useSharedValue(false);
  const moveType = useSharedValue(SelectorMoveType.NONE);
  const originalPathPoints = useSharedValue(toCoordinatesArray(selectedElement?.d));
  const topLeft = useSharedValue({ x: originalBoundingBox.left, y: originalBoundingBox.top });
  const bottomRight = useSharedValue({
    x: originalBoundingBox.left + originalBoundingBox.width,
    y: originalBoundingBox.top + originalBoundingBox.height,
  });

  const isMoving = useDerivedValue(() => moveType.value !== SelectorMoveType.NONE);
  const top = useDerivedValue(() => topLeft.value.y);
  const left = useDerivedValue(() => topLeft.value.x);
  const width = useDerivedValue(() => bottomRight.value.x - topLeft.value.x);
  const height = useDerivedValue(() => bottomRight.value.y - topLeft.value.y);

  const containerStyle = useAnimatedStyle(() => ({
    top: top.value,
    left: left.value,
    width: width.value,
    height: height.value,
    borderStyle: isMoving.value ? "dotted" : "dashed",
  }));

  useEffect(() => {
    // isSelectionAreaDirty is used in the useAnimatedProps below for path animated style
    // this solve the issue of drawing the previous path momentarily before the new one is drawn
    // however this is causing a small delay before the new path is drawn, causing a flicker effect
    // to solve this, we need to recompute all the following values within a "worklet" and then we
    // also need to migrate the dependencies library code we use within a worklet
    // (like pathParser from "parse-svg-path")
    originalPathPoints.value = toCoordinatesArray(selectedElement?.d);
    topLeft.value = { x: originalBoundingBox.left, y: originalBoundingBox.top };
    bottomRight.value = {
      x: originalBoundingBox.left + originalBoundingBox.width,
      y: originalBoundingBox.top + originalBoundingBox.height,
    };
    isSelectionAreaDirty.value = false;
  }, [selectedElement, originalBoundingBox]);

  const d = useDerivedValue<string>(() => {
    if (moveType.value === SelectorMoveType.NONE) {
      return selectedElement?.d ?? "";
    }

    if (moveType.value === SelectorMoveType.BOUNDING_BOX) {
      const deltaX = left.value - originalBoundingBox.left;
      const deltaY = top.value - originalBoundingBox.top;
      const newPoints = originalPathPoints.value.map(point => ({ x: point.x + deltaX, y: point.y + deltaY }));
      return fromCoordinatesArray(newPoints);
    }

    if (moveType.value === SelectorMoveType.BOTTOM_RIGHT) {
      const stretchX = width.value / originalBoundingBox.width;
      const stretchY = height.value / originalBoundingBox.height;

      const minX = Math.min(...originalPathPoints.value.map(({ x }) => x));
      const deltaX = minX * stretchX - left.value;

      const minY = Math.min(...originalPathPoints.value.map(({ y }) => y));
      const deltaY = minY * stretchY - top.value;

      const newPoints = originalPathPoints.value.map(({ x, y }) => ({
        x: x * stretchX - deltaX,
        y: y * stretchY - deltaY,
      }));
      return fromCoordinatesArray(newPoints);
    }

    if (moveType.value === SelectorMoveType.TOP_LEFT) {
      const stretchX = width.value / originalBoundingBox.width;
      const stretchY = height.value / originalBoundingBox.height;

      const maxX = Math.max(...originalPathPoints.value.map(({ x }) => x));
      const deltaX = maxX * stretchX - (left.value + width.value);

      const maxY = Math.max(...originalPathPoints.value.map(({ y }) => y));
      const deltaY = maxY * stretchY - (top.value + height.value);

      const newPoints = originalPathPoints.value.map(({ x, y }) => ({
        x: x * stretchX - deltaX,
        y: y * stretchY - deltaY,
      }));
      return fromCoordinatesArray(newPoints);
    }

    return "";
  });

  const onDragTopLeft = Gesture.Pan()
    .onStart(() => {
      setupRegionContext({ context, topLeft, bottomRight, MAX_X, MAX_Y, zoomLevel });
      moveType.value = SelectorMoveType.TOP_LEFT;
    })
    .onChange(event => {
      topLeft.value = onTopLeftDrag(event, context);
    })
    .onEnd(() => {
      applyTopLeftSnap(topLeft);
      moveType.value = SelectorMoveType.NONE;
      isSelectionAreaDirty.value = true;
      runOnJS(onDrawElementUpdate)({ ...selectedElement, d: d.value } as SvgPathElement);
    });

  const onDragBottomRight = Gesture.Pan()
    .onStart(() => {
      setupRegionContext({ context, topLeft, bottomRight, MAX_X, MAX_Y, zoomLevel });
      moveType.value = SelectorMoveType.BOTTOM_RIGHT;
    })
    .onChange(event => {
      bottomRight.value = onBottomRightDrag(event, context);
    })
    .onEnd(() => {
      applyBottomRightSnap(bottomRight, MAX_X, MAX_Y);
      moveType.value = SelectorMoveType.NONE;
      isSelectionAreaDirty.value = true;
      runOnJS(onDrawElementUpdate)({ ...selectedElement, d: d.value } as SvgPathElement);
    });

  const onDragRectangle = Gesture.Pan()
    .onStart(() => {
      setupRegionContext({ context, topLeft, bottomRight, MAX_X, MAX_Y, zoomLevel });
      moveType.value = SelectorMoveType.BOUNDING_BOX;
    })
    .onChange(event => {
      const { newTopLeft, newBottomRight } = onRegionDrag(event, context);
      topLeft.value = newTopLeft;
      bottomRight.value = newBottomRight;
    })
    .onEnd(() => {
      moveType.value = SelectorMoveType.NONE;
      isSelectionAreaDirty.value = true;
      runOnJS(onDrawElementUpdate)({ ...selectedElement, d: d.value } as SvgPathElement);
    });

  const animatedProps = useAnimatedProps(() => ({ d: isSelectionAreaDirty.value ? "" : d.value }));

  if (!selectedElement) {
    return null;
  }

  return (
    <>
      <MovableHandle position={topLeft} onDrag={onDragTopLeft} />
      <MovableHandle position={bottomRight} onDrag={onDragBottomRight} />

      <Animated.View style={styles.animatedViewContainer}>
        <AnimatedSvg height="100%" width="100%">
          <AnimatedPath
            fill="none"
            animatedProps={animatedProps}
            stroke={selectedElement.strokeColor}
            strokeWidth={selectedElement.strokeWidth}
          />
        </AnimatedSvg>
      </Animated.View>

      <GestureDetector gesture={onDragRectangle}>
        <AnimatedView style={[styles.rectangleRegion, containerStyle]} />
      </GestureDetector>
    </>
  );
};
