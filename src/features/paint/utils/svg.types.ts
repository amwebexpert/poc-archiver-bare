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
  strokeColor: string;
  strokeWidth: number;
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
  fill: string;
};

export type SerializerInputs<E extends SvgElement> = {
  element: E;
  screenScale?: number;
};

export type DeserializerInputs = {
  xmlElementAttributes: Record<string, string>;
  screenScale?: number;
};

export type XmlSerializer<E extends SvgElement> = (inputs: SerializerInputs<E>) => string;
export type XmlDeserializer<E extends SvgElement> = (inputs: DeserializerInputs) => E;

export type XmlSerializationHandler<E extends SvgElement> = {
  serializer: XmlSerializer<E>;
  deserializer: XmlDeserializer<E>;
};
