import { useState } from "react";

import { CanvasDimensions, CanvasSurface } from "../types/canvas.types";
import { computeMaxDimensionsForAspectRatio } from "../utils/canvas.utils";

export const useCanvasDimensions = () => {
  const [canvasDimensions, setCanvasDimensions] = useState<CanvasDimensions>();
  const isCanvasDimensionsAvailable = !!canvasDimensions;

  const onCanvasParentLayoutDimensions = ({ width, height }: CanvasSurface) =>
    setCanvasDimensions(computeMaxDimensionsForAspectRatio({ width, height }));

  return {
    isCanvasDimensionsAvailable,
    canvasDimensions,
    onCanvasParentLayoutDimensions,
  };
};
