import { FunctionComponent } from "react";

import { ZERO_BOUNDING_BOX } from "../../../constants";

import { SelectorProps } from "./selector.types";
import { SvgElementType } from "../../../types/svg.types";
import { PathSelector } from "./path-selector";

export const Selector: FunctionComponent<SelectorProps> = ({
  originalBoundingBox = ZERO_BOUNDING_BOX,
  selectedElement,
  onDrawElementUpdate = () => {},
}) => {
  if (!selectedElement || !originalBoundingBox) {
    return null;
  }

  if (selectedElement.type === SvgElementType.path) {
    return (
      <PathSelector
        originalBoundingBox={originalBoundingBox}
        selectedElement={selectedElement}
        onDrawElementUpdate={onDrawElementUpdate}
      />
    );
  }

  return null;
};
