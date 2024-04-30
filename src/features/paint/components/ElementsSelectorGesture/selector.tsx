import { FunctionComponent } from "react";

import { SvgElementType, SvgEllipseElement, SvgPathElement } from "../../types/svg.types";
import { EllipseSelector } from "./ellipse-selector";
import { PathSelector } from "./path-selector";
import { SelectorProps } from "./selector.types";

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
