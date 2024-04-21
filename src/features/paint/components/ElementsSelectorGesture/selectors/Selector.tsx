import { FunctionComponent } from "react";

import { ZERO_BOUNDING_BOX } from "../../../constants";

import { SelectorProps } from "./selector.types";
import { SvgElementType, SvgEllipseElement, SvgPathElement } from "../../../types/svg.types";
import { PathSelector } from "./path-selector";
import { EllipseSelector } from "./ellipse-selector";

export const Selector: FunctionComponent<SelectorProps> = ({
  originalBoundingBox,
  selectedElement,
  onDrawElementUpdate,
}) => {
  const { type } = selectedElement;

  if (type === SvgElementType.path) {
    return (
      <PathSelector
        originalBoundingBox={originalBoundingBox}
        selectedElement={selectedElement as SvgPathElement}
        onDrawElementUpdate={onDrawElementUpdate}
      />
    );
  }

  if (type === SvgElementType.ellipse) {
    return (
      <EllipseSelector
        originalBoundingBox={originalBoundingBox}
        selectedElement={selectedElement as SvgEllipseElement}
        onDrawElementUpdate={onDrawElementUpdate}
      />
    );
  }

  return null;
};
