import { useState } from "react";

import { computeMaxDimensionsForAspectRatio_16_9 } from "../utils/canvas.utils";
import { CanvasDimensions, CanvasSurface, DEFAULT_DIMENSIONS } from "../constants";

export const useCanvasDimensions = () => {
  const [canvasDimensions, setCanvasDimensions] = useState<CanvasDimensions>();
  const isCanvasDimensionsAvailable = !!canvasDimensions;

  const onCanvasParentLayoutDimensions = ({ width, height }: CanvasSurface) =>
    setCanvasDimensions(computeMaxDimensionsForAspectRatio_16_9({ width, height }));

  return {
    isCanvasDimensionsAvailable,
    canvasDimensions,
    onCanvasParentLayoutDimensions,
  };
};
