import { SharedValue } from "react-native-reanimated";
import { XYCoordinates } from "../canvas.types";
import { DEFAULT_COORDINATES } from "../constants";
import { SNAP_DELTA } from "./constants";
import { AnimationEventType, ContextType } from "./selectors.types";

// optional (dont call it if you don't want a "snap 2 the edge" behavior)
export const applyBottomRightSnap = (position: SharedValue<XYCoordinates>, maxX = 0, maxY = 0) => {
  "worklet";

  const newX = position.value.x;
  const newY = position.value.y;

  position.value = {
    x: maxX - newX < SNAP_DELTA ? maxX : newX,
    y: maxY - newY < SNAP_DELTA ? maxY : newY,
  };
};

// optional (dont call it if you don't want a "snap 2 the edge" behavior)
export const applyTopLeftSnap = (position: SharedValue<XYCoordinates>) => {
  "worklet";

  const newX = position.value.x;
  const newY = position.value.y;
  position.value = {
    x: newX < SNAP_DELTA ? 0 : newX,
    y: newY < SNAP_DELTA ? 0 : newY,
  };
};

type setupRegionContextInputs = {
  context: ContextType;
  topLeft: SharedValue<XYCoordinates>;
  bottomRight: SharedValue<XYCoordinates>;
  MAX_X: number;
  MAX_Y: number;
  zoomLevel: number;
};

export const setupRegionContext = ({
  context,
  topLeft,
  bottomRight,
  MAX_X = 0,
  MAX_Y = 0,
  zoomLevel = 1,
}: setupRegionContextInputs) => {
  "worklet";

  context.zoomLevel = zoomLevel;
  context.topLeft = topLeft.value;
  context.bottomRight = bottomRight.value;
  context.rectangleWidth = bottomRight.value.x - topLeft.value.x;
  context.rectangleHeight = bottomRight.value.y - topLeft.value.y;
  context.MAX_X = MAX_X;
  context.MAX_Y = MAX_Y;
};

export const onRegionDrag = (event: AnimationEventType, context: ContextType) => {
  "worklet";

  const {
    topLeft = DEFAULT_COORDINATES,
    rectangleWidth = 0,
    rectangleHeight = 0,
    MAX_X = 0,
    MAX_Y = 0,
    zoomLevel = 1,
  } = context;

  const unboundedX = event.translationX / zoomLevel + topLeft.x;
  let x = unboundedX < 0 ? 0 : unboundedX;
  if (x + rectangleWidth > MAX_X) {
    x = MAX_X - rectangleWidth;
  }

  const unboundedY = event.translationY / zoomLevel + topLeft.y;
  let y = unboundedY < 0 ? 0 : unboundedY;
  if (y + rectangleHeight > MAX_Y) {
    y = MAX_Y - rectangleHeight;
  }

  return {
    newTopLeft: { x, y },
    newBottomRight: { x: x + rectangleWidth, y: y + rectangleHeight },
  };
};

export const onTopLeftDrag = (event: AnimationEventType, context: ContextType) => {
  "worklet";

  const { topLeft = DEFAULT_COORDINATES, bottomRight = DEFAULT_COORDINATES, zoomLevel = 1 } = context;

  const unboundedX = event.translationX / zoomLevel + topLeft.x;
  let x = unboundedX < 0 ? 0 : unboundedX;
  if (x > bottomRight.x) {
    x = bottomRight.x - 1;
  }

  const unboundedY = event.translationY / zoomLevel + topLeft.y;
  let y = unboundedY < 0 ? 0 : unboundedY;
  if (y > bottomRight.y) {
    y = bottomRight.y - 1;
  }

  return { x, y };
};

export const onBottomRightDrag = (event: AnimationEventType, context: ContextType) => {
  "worklet";

  const {
    topLeft = DEFAULT_COORDINATES,
    bottomRight = DEFAULT_COORDINATES,
    MAX_X = 0,
    MAX_Y = 0,
    zoomLevel = 0,
  } = context;

  const unboundedX = event.translationX / zoomLevel + bottomRight.x;
  let x = unboundedX > MAX_X ? MAX_X : unboundedX;
  if (x < topLeft.x) {
    x = topLeft.x + 1;
  }

  const unboundedY = event.translationY / zoomLevel + bottomRight.y;
  let y = unboundedY > MAX_Y ? MAX_Y : unboundedY;
  if (y < topLeft.y) {
    y = topLeft.y + 1;
  }

  return { x, y };
};
