export enum CanvasMode {
  ZOOM_PAN = "ZOOM_PAN",
  DRAW = "DRAW",
  SELECTOR = "SELECTOR",
  TRANSFORM = "TRANSFORM",
}

export enum SvgElementType {
  path = "path",
  circle = "circle",
  rect = "rect",
  ellipse = "ellipse",
  line = "line",
  polyline = "polyline",
  polygon = "polygon",
  text = "text",
}

export type CanvasDimensions = {
  width: number;
  height: number;
};

export type XYCoordinates = {
  x: number;
  y: number;
};

export const CANVAS_DIMENSIONS: CanvasDimensions = { width: 2550, height: 3300 }; // match 8.5" x 11" at 300 dpi
export const DEFAULT_DIMENSIONS: CanvasDimensions = { width: 0, height: 0 };
export const CANVAS_WRAPPER_PADDING = 8;

export const DEFAULT_COORDINATES: XYCoordinates = { x: 0, y: 0 };

export const SINGLE_TAP_MAX_DISTANCE = 5;

export const DEFAULT_SELECTION_DASH_ARRAY = "3, 3";

export const DEFAULT_STROKE_WIDTH = 3;

// @see http://mourner.github.io/simplify-js/
export const PathSimplificationConfigs = Object.freeze({
  tolerance: 0.2,
  highQuality: true,
});