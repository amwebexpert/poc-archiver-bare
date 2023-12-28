import { XYCoordinates } from "../constants";

export type ContextType = {
  zoomLevel?: number;
  topLeft?: XYCoordinates;
  bottomRight?: XYCoordinates;
  rectangleWidth?: number;
  rectangleHeight?: number;
  MAX_X?: number;
  MAX_Y?: number;
};

export type AnimationEventType = {
  translationX: number;
  translationY: number;
};
