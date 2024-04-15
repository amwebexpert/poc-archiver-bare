import { FunctionComponent } from "react";
import { SvgElementType } from "../../types/svg.types";
import { CircleView } from "./CircleView";
import { EllipseView } from "./EllipseView";
import { PathView } from "./PathView";

export const ELEMENT_VIEWERS: Map<SvgElementType, FunctionComponent<any>> = new Map([
  [SvgElementType.path, PathView],
  [SvgElementType.circle, CircleView],
  [SvgElementType.ellipse, EllipseView],
]);
