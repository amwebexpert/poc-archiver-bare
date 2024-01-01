import pathParser from "parse-svg-path";
import { PixelRatio, Platform } from "react-native";

import { DEFAULT_CANVAS_DIMENSIONS, SINGLE_TAP_MAX_DISTANCE, ZERO_BOUNDING_BOX, ZERO_COORDINATES } from "../constants";

import { AspectRatio, BoundingBox, CanvasDimensions } from "../types/canvas.types";
import { SvgCircleElement, SvgElement, SvgPathElement, isCircle, isPath } from "../types/svg.types";
import { buildCircleElementFromSingleTapPath } from "./svg-circle.utils";
import { buildPathElement, getPathPoints, normalizePath } from "./svg-path.utils";

type MaxDimensionsForAspectRatioInputTypes = {
  width: number;
  height: number;
  aspectRatio?: AspectRatio;
};
export const computeMaxDimensionsForAspectRatio = (inputs: MaxDimensionsForAspectRatioInputTypes): CanvasDimensions => {
  const { width, height, aspectRatio = DEFAULT_CANVAS_DIMENSIONS } = inputs;
  const computedHeightBasedOnWidth = (width * aspectRatio.height) / aspectRatio.width;
  const computedWidthBasedOnHeight = (height * aspectRatio.width) / aspectRatio.height;

  // @see https://github.com/software-mansion/react-native-svg/issues/855#issuecomment-445340830
  const svgSnapshotPlatformScaleFactor = Platform.select({ ios: 1, android: 1 / PixelRatio.get() }) ?? 1;

  if (computedHeightBasedOnWidth <= height) {
    // take full width and adjust height
    const screenScale = width / aspectRatio.width;
    const snapshotScale = (aspectRatio.width / width) * svgSnapshotPlatformScaleFactor;
    return { width, height: computedHeightBasedOnWidth, snapshotScale, screenScale };
  } else {
    // take full height and adjust width
    const screenScale = height / aspectRatio.height;
    const snapshotScale = (aspectRatio.height / height) * svgSnapshotPlatformScaleFactor;
    return { width: computedWidthBasedOnHeight, height, snapshotScale, screenScale };
  }
};

export const computeDistance = ({ p1 = ZERO_COORDINATES, p2 = ZERO_COORDINATES }) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
};

export const isSimpleTapPath = (d = "") => {
  const commands = pathParser(normalizePath(d));
  if (commands.length !== 2) {
    return false;
  }

  // only M and L commands are allowed for a simple tap
  if (commands.some(([command]) => !["M", "L"].includes(command))) {
    return false;
  }

  const points = commands.map(([_command, x, y]) => ({ x, y }));
  const [p1, p2] = points;
  const distance = computeDistance({ p1, p2 });

  return distance < SINGLE_TAP_MAX_DISTANCE;
};

export const createElementFromPathGesture = ({ d = "", strokeColor = "black", strokeWidth = 1 }) => {
  if (isSimpleTapPath(d)) {
    return buildCircleElementFromSingleTapPath({ d, strokeColor, strokeWidth });
  } else {
    return buildPathElement({ d, strokeColor, strokeWidth });
  }
};

export const computeBoundingBox = (element: SvgElement): BoundingBox => {
  if (isPath(element)) {
    return computeBoundingBoxOfPathElement(element);
  }

  if (isCircle(element)) {
    return computeBoundingBoxOfCircleElement(element);
  }

  return ZERO_BOUNDING_BOX;
};

export const computeBoundingBoxOfCircleElement = (element: SvgCircleElement): BoundingBox => {
  const radius = element.radius ?? 0;
  const size = radius * 2;
  if (radius <= 0) {
    return ZERO_BOUNDING_BOX;
  }

  return {
    left: element.cx ?? 0 - radius,
    top: element.cy ?? 0 - radius,
    width: size,
    height: size,
  };
};

export const computeBoundingBoxOfPathElement = (element: SvgPathElement): BoundingBox => {
  const points = getPathPoints(element.d);
  const [firstPoint, ...rest] = points;

  const { x, y } = firstPoint;
  const initialInfo = { minX: x, minY: y, maxX: x, maxY: y };

  const infos = rest.reduce(
    (acc, { x, y }) => ({
      minX: Math.min(acc.minX, x),
      minY: Math.min(acc.minY, y),
      maxX: Math.max(acc.maxX, x),
      maxY: Math.max(acc.maxY, y),
    }),
    initialInfo,
  );

  const { minX, minY, maxX, maxY } = infos;

  return {
    left: minX,
    top: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};
