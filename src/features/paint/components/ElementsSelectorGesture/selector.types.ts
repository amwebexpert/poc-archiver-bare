import { BoundingBox } from "../../types/canvas.types";
import { SvgElement } from "../../types/svg.types";

export type SelectorProps<T extends SvgElement = SvgElement> = {
  originalBoundingBox: BoundingBox;
  selectedElement: T;
  onDrawElementUpdate: (updated: T) => void;
};
