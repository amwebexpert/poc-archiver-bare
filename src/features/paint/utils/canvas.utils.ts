import pathParser from "parse-svg-path";

import {
  DEFAULT_CANVAS_DIMENSIONS,
  SINGLE_TAP_MAX_DISTANCE,
  SVG_SNAPSHOT_SCALE_FACTOR,
  ZERO_BOUNDING_BOX,
  ZERO_COORDINATES,
} from "../constants";

import type { AspectRatio, BoundingBox, CanvasDimensions } from "../types/canvas.types";
import {
  type SvgCircleElement,
  type SvgElement,
  type SvgEllipseElement,
  type SvgPathElement,
  isCircle,
  isEllipse,
  isPath,
} from "../types/svg.types";
import { buildCircleElementFromSingleTapPath } from "./svg-circle.utils";
import { buildPathElement, normalizePath, toCoordinatesArray } from "./svg-path.utils";

type MaxDimensionsForAspectRatioInputTypes = {
  width: number;
  height: number;
  targetDimensionsForScale?: AspectRatio;
};
export const computeMaxDimensionsForAspectRatio = (inputs: MaxDimensionsForAspectRatioInputTypes): CanvasDimensions => {
  const { width, height, targetDimensionsForScale = DEFAULT_CANVAS_DIMENSIONS } = inputs;
  const computedHeightBasedOnWidth = (width * targetDimensionsForScale.height) / targetDimensionsForScale.width;
  const computedWidthBasedOnHeight = (height * targetDimensionsForScale.width) / targetDimensionsForScale.height;

  if (computedHeightBasedOnWidth <= height) {
    // take full width and adjust height
    const screenScale = width / targetDimensionsForScale.width;
    const snapshotScale = (targetDimensionsForScale.width / width) * SVG_SNAPSHOT_SCALE_FACTOR;
    return { width, height: computedHeightBasedOnWidth, snapshotScale, screenScale };
  }

  // take full height and adjust width
  const screenScale = height / targetDimensionsForScale.height;
  const snapshotScale = (targetDimensionsForScale.height / height) * SVG_SNAPSHOT_SCALE_FACTOR;
  return { width: computedWidthBasedOnHeight, height, snapshotScale, screenScale };
};

export const computeDistance = ({ p1 = ZERO_COORDINATES, p2 = ZERO_COORDINATES }) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  return Math.sqrt(dx ** 2 + dy ** 2);
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
  }

  return buildPathElement({ d, strokeColor, strokeWidth });
};

export const computeBoundingBox = (element: SvgElement): BoundingBox => {
  if (isPath(element)) {
    return computeBoundingBoxOfPathElement(element);
  }

  if (isCircle(element)) {
    return computeBoundingBoxOfCircleElement(element);
  }

  if (isEllipse(element)) {
    return computeBoundingBoxOfEllipseElement(element);
  }

  return ZERO_BOUNDING_BOX;
};

export const computeBoundingBoxOfCircleElement = (element: SvgCircleElement): BoundingBox => {
  const radius = element.radius ?? 0;
  if (radius <= 0) {
    return ZERO_BOUNDING_BOX;
  }

  const size = radius * 2;

  return {
    left: (element.cx ?? 0) - radius,
    top: (element.cy ?? 0) - radius,
    width: size,
    height: size,
  };
};

export const computeBoundingBoxOfEllipseElement = (element: SvgEllipseElement): BoundingBox => {
  const rx = element.rx ?? 0;
  const ry = element.ry ?? 0;

  if (rx <= 0 || ry <= 0) {
    return ZERO_BOUNDING_BOX;
  }

  return {
    left: (element.cx ?? 0) - rx,
    top: (element.cy ?? 0) - ry,
    width: rx * 2,
    height: ry * 2,
  };
};

export const computeBoundingBoxOfPathElement = (element: SvgPathElement): BoundingBox => {
  const points = toCoordinatesArray(element.d);
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
