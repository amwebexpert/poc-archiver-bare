import paintStore from "../../stores/paint.store";
import { CIRCLE_SIZE } from "../constants";

export const useMovableHandleSize = () => {
  const zoomLevel = paintStore.zoomAndPanInfo.zoomLevel;
  const circleSize = CIRCLE_SIZE / zoomLevel;
  const halfCircleSize = circleSize / 2;

  return {
    halfCircleSize,
    circleSize,
  };
};
