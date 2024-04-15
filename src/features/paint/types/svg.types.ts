export enum SvgElementType {
  path = "path",
  circle = "circle",
  rect = "rect",
  ellipse = "ellipse",
  line = "line",
  polyline = "polyline",
  polygon = "polygon",
  text = "text",
}

export type SvgElement = {
  id: number;
  type: SvgElementType;
  strokeColor?: string;
  strokeWidth?: number;
  fill?: string;
  isSelected?: boolean;
};

export type SvgPathElement = SvgElement & {
  type: SvgElementType.path;
  d: string;
};

export type SvgCircleElement = SvgElement & {
  type: SvgElementType.circle;
  cx: number;
  cy: number;
  radius: number;
};

export type SvgEllipseElement = Omit<SvgCircleElement, "radius"> & {
  type: SvgElementType.ellipse;
  rx: number;
  ry: number;
};

export const isPath = (element?: SvgElement): element is SvgPathElement => element?.type === SvgElementType.path;

export const isCircle = (element?: SvgElement): element is SvgCircleElement => element?.type === SvgElementType.circle;

export const isEllipse = (element?: SvgElement): element is SvgEllipseElement =>
  element?.type === SvgElementType.ellipse;
