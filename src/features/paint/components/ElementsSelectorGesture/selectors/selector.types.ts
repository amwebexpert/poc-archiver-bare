import { BoundingBox, CanvasDimensions } from "../../../types/canvas.types";
import { SvgElement, SvgPathElement } from "../../../types/svg.types";

export type SelectorProps = {
  originalBoundingBox: BoundingBox;
  selectedElement?: SvgPathElement;
  onDrawElementUpdate?: (updated: SvgElement) => void;
};
