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
import { SvgEllipseElement, SvgPathElement } from "../../../types/svg.types";
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
import { AnimatedEllipse, AnimatedPath, AnimatedSvg, AnimatedView } from "./selector.constants";
import { styles } from "./selector.styles";
import { SelectorProps } from "./selector.types";

export const EllipseSelector: FunctionComponent<SelectorProps<SvgEllipseElement>> = ({
  originalBoundingBox = ZERO_BOUNDING_BOX,
  selectedElement,
  onDrawElementUpdate = () => {},
}) => {
  const zoomLevel = paintStore.zoomAndPanInfo.zoomLevel;
  const { width: MAX_X, height: MAX_Y } = paintStore.canvasDimensions;
  const context = useSharedValue<Record<string, any>>({});

  const isSelectionAreaDirty = useSharedValue(false);
  const moveType = useSharedValue(SelectorMoveType.NONE);
  const originalElement = useSharedValue(selectedElement);
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
    originalElement.value = selectedElement;
    topLeft.value = { x: originalBoundingBox.left, y: originalBoundingBox.top };
    bottomRight.value = {
      x: originalBoundingBox.left + originalBoundingBox.width,
      y: originalBoundingBox.top + originalBoundingBox.height,
    };
    isSelectionAreaDirty.value = false;
  }, [selectedElement, originalBoundingBox]);

  const sharedEllipse = useDerivedValue<SvgEllipseElement>(() => {
    if (moveType.value === SelectorMoveType.NONE) {
      return selectedElement;
    }

    if (moveType.value === SelectorMoveType.BOUNDING_BOX) {
      const deltaX = left.value - originalBoundingBox.left;
      const deltaY = top.value - originalBoundingBox.top;
      return {
        ...originalElement.value,
        cx: originalElement.value.cx + deltaX,
        cy: originalElement.value.cy + deltaY,
      };
    }

    if (moveType.value === SelectorMoveType.BOTTOM_RIGHT) {
      const stretchX = width.value / originalBoundingBox.width;
      const stretchY = height.value / originalBoundingBox.height;

      const rx = originalElement.value.rx * stretchX;
      const ry = originalElement.value.ry * stretchY;

      const deltaX = rx - originalElement.value.rx;
      const deltaY = ry - originalElement.value.ry;

      return {
        ...originalElement.value,
        rx,
        ry,
        cx: originalElement.value.cx + deltaX,
        cy: originalElement.value.cy + deltaY,
      };
    }

    if (moveType.value === SelectorMoveType.TOP_LEFT) {
      const stretchX = width.value / originalBoundingBox.width;
      const stretchY = height.value / originalBoundingBox.height;

      const rx = originalElement.value.rx * stretchX;
      const ry = originalElement.value.ry * stretchY;

      const deltaX = rx - originalElement.value.rx;
      const deltaY = ry - originalElement.value.ry;

      return {
        ...originalElement.value,
        rx,
        ry,
        cx: originalElement.value.cx - deltaX,
        cy: originalElement.value.cy - deltaY,
      };
    }

    return selectedElement;
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
      runOnJS(onDrawElementUpdate)({ ...selectedElement, ...sharedEllipse.value } as SvgEllipseElement);
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
      runOnJS(onDrawElementUpdate)({ ...selectedElement, ...sharedEllipse.value } as SvgEllipseElement);
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
      runOnJS(onDrawElementUpdate)({ ...selectedElement, ...sharedEllipse.value } as SvgEllipseElement);
    });

  const animatedProps = useAnimatedProps(() => ({
    cx: isSelectionAreaDirty.value ? undefined : sharedEllipse.value.cx,
    cy: isSelectionAreaDirty.value ? undefined : sharedEllipse.value.cy,
    rx: isSelectionAreaDirty.value ? undefined : sharedEllipse.value.rx,
    ry: isSelectionAreaDirty.value ? undefined : sharedEllipse.value.ry,
  }));

  if (!selectedElement) {
    return null;
  }

  return (
    <>
      <MovableHandle position={topLeft} onDrag={onDragTopLeft} />
      <MovableHandle position={bottomRight} onDrag={onDragBottomRight} />

      <Animated.View style={styles.animatedViewContainer}>
        <AnimatedSvg height="100%" width="100%">
          <AnimatedEllipse
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
