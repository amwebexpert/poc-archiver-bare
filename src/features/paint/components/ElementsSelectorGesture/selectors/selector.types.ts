import { BoundingBox } from "../../../types/canvas.types";
import { SvgElement } from "../../../types/svg.types";

export type SelectorProps = {
  originalBoundingBox: BoundingBox;
  selectedElement?: SvgElement;
  onDrawElementUpdate?: (updated: SvgElement) => void;
};
