import { computeBoundingBox } from "../utils/canvasUtils";
import paintStore from "../Paint.store";
import { SvgElementType } from "../utils/svg.types";

export const useSelectedElements = () => {
  const { elements, selectedElementIDs } = paintStore;

  const elementsWithSelectedFlag = elements.map(e => ({ ...e, isSelected: selectedElementIDs.includes(e.id) }));
  const selectedElements = elementsWithSelectedFlag.filter(({ isSelected }) => isSelected);
  const unselectedElements = elementsWithSelectedFlag.filter(({ isSelected }) => !isSelected);
  const originalBoundingBox = computeBoundingBox(selectedElements[0]); // DMA-207 Support multiple elements
  const isBoundingBoxReady = !!originalBoundingBox;
  const hasSingleSelectedPath = selectedElements.length === 1 && selectedElements[0].type === SvgElementType.path;

  return {
    selectedElements,
    unselectedElements,
    elementsWithSelectedFlag,
    originalBoundingBox,
    isBoundingBoxReady,
    hasSingleSelectedPath,
  };
};
