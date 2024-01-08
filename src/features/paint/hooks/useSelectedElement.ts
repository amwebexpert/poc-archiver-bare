import { computeBoundingBox } from "../utils/canvas.utils";
import paintStore from "../stores/paint.store";
import { SvgElement, SvgElementType } from "../types/svg.types";

export type SvgElementWithSelectedFlag = SvgElement & { isSelected: boolean };

export const useSelectedElements = () => {
  const { elements, selectedElementIDs } = paintStore;

  const selectedElements = elements.filter(({ id }) => selectedElementIDs.includes(id));
  const unselectedElements = elements.filter(({ id }) => !selectedElementIDs.includes(id));
  const originalBoundingBox = computeBoundingBox(selectedElements[0]); // TODO Support multiple elements
  const isBoundingBoxReady = !!originalBoundingBox;
  const hasSingleSelectedPath = selectedElements.length === 1 && selectedElements[0].type === SvgElementType.path;

  return {
    selectedElements,
    unselectedElements,
    originalBoundingBox,
    isBoundingBoxReady,
    hasSingleSelectedPath,
  };
};
