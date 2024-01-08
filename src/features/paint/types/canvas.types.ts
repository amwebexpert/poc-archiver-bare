export enum CanvasMode {
  ZOOM_PAN = "ZOOM_PAN",
  DRAW = "DRAW",
  SELECTOR = "SELECTOR",
  TRANSFORM = "TRANSFORM",
}

export type AspectRatio = { width: number; height: number };
export const DEFAULT_ASPECT_RATIO: Readonly<AspectRatio> = { width: 9, height: 16 };

export type CanvasSurface = { width: number; height: number };
export type CanvasDimensions = CanvasSurface & { snapshotScale: number; screenScale: number };
export type XYCoordinates = { x: number; y: number };

export type BoundingBox = { left: number; top: number; width: number; height: number };
