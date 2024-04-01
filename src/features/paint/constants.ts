import { PixelRatio, Platform, StyleSheet } from "react-native";
import { BoundingBox, CanvasDimensions, DEFAULT_ASPECT_RATIO, XYCoordinates } from "./types/canvas.types";

// @see https://github.com/software-mansion/react-native-svg/issues/855#issuecomment-445340830
export const SVG_SNAPSHOT_SCALE_FACTOR = Platform.select({ ios: 1, android: 1 / PixelRatio.get() }) ?? 1;

// @see https://www.selfemployedartist.com/blog/best-canvas-sizes
export const DEFAULT_CANVAS_DIMENSIONS: Readonly<CanvasDimensions> = {
  width: DEFAULT_ASPECT_RATIO.width * 100,
  height: DEFAULT_ASPECT_RATIO.height * 100,
  snapshotScale: SVG_SNAPSHOT_SCALE_FACTOR,
  screenScale: 1,
};

export const ZERO_DIMENSIONS: Readonly<CanvasDimensions> = { width: 0, height: 0, snapshotScale: 1, screenScale: 1 };
export const ZERO_BOUNDING_BOX: Readonly<BoundingBox> = { left: 0, top: 0, width: 0, height: 0 };
export const CANVAS_WRAPPER_PADDING = 8;

export const ZERO_COORDINATES: Readonly<XYCoordinates> = { x: 0, y: 0 };

export const SINGLE_TAP_MAX_DISTANCE = 5;

export const DEFAULT_SELECTION_DASH_ARRAY = "3, 3";

export const DEFAULT_STROKE_WIDTH = 3;

// @see http://mourner.github.io/simplify-js/
export const PathSimplificationConfigs = Object.freeze({ tolerance: 0.2, highQuality: true });
