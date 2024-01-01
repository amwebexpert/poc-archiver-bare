import pathParser from "parse-svg-path";

import { SvgCircleElement, SvgElementType, isCircle } from "../types/svg.types";
import { normalizePath } from "./svg-path.utils";
import {
  XmlDeserializer,
  XmlSerializationHandler,
  XmlSerializer,
  extractNumericAttribute,
} from "./svg-serialization.utils";

export const serializer: XmlSerializer = ({ element, screenScale = 1 }) => {
  if (!isCircle(element)) {
    throw new Error(`Cannot serialize non-circle element: ${JSON.stringify(element)}`);
  }

  const { id, cx, cy, radius, strokeColor: stroke, strokeWidth: width, fill } = element;
  const x = cx / screenScale;
  const y = cy / screenScale;
  const r = radius / screenScale;

  return `<circle id="${id}" cx="${x}" cy="${y}" r="${r}" stroke="${stroke}" stroke-width="${width}" fill="${fill}" />`;
};

export const deserializer: XmlDeserializer = ({ xmlElementAttributes, screenScale = 1 }) => {
  const cx = extractNumericAttribute({ xmlElementAttributes, key: "@_cx" }) ?? 0 * screenScale;
  const cy = extractNumericAttribute({ xmlElementAttributes, key: "@_cy" }) ?? 0 * screenScale;
  const radius = extractNumericAttribute({ xmlElementAttributes, key: "@_r" }) ?? 0 * screenScale;
  const id = extractNumericAttribute({ xmlElementAttributes, key: "@_id" }) ?? 0;
  const strokeColor = xmlElementAttributes["@_stroke"];
  const strokeWidth = extractNumericAttribute({ xmlElementAttributes, key: "@_stroke-width" });
  const fill = xmlElementAttributes["@_fill"] ?? "none";

  return { type: SvgElementType.circle, id, cx, cy, radius, strokeColor, strokeWidth, fill };
};

export const CIRCLE_SERIALIZER: XmlSerializationHandler = { serializer, deserializer };

export const buildCircleElementFromSingleTapPath = ({
  d = "",
  strokeColor = "black",
  strokeWidth = 1,
}): SvgCircleElement => {
  const commands = pathParser(normalizePath(d));
  const [firstCommand] = commands;
  const [_command, cx, cy] = firstCommand;

  return {
    type: SvgElementType.circle,
    cx,
    cy,
    radius: strokeWidth / 2,
    fill: strokeColor,
    strokeColor,
    strokeWidth: 0,
    id: Date.now(),
  };
};
