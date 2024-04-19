import pathParser from "parse-svg-path";

import { SvgCircleElement, SvgElementType, isCircle } from "../types/svg.types";
import { normalizePath } from "./svg-path.utils";
import {
  XmlDeserializer,
  XmlSerializationHandler,
  XmlSerializer,
  extractColorAttribute,
  extractNumericAttribute,
} from "./svg-serialization.utils";

export const serializer: XmlSerializer = ({ element, screenScale = 1 }) => {
  if (!isCircle(element)) {
    throw new Error(`Cannot serialize non-circle element: ${JSON.stringify(element)}`);
  }

  const { id, cx, cy, radius, strokeColor = "none", strokeWidth = 0, fill = "none" } = element;
  const x = cx / screenScale;
  const y = cy / screenScale;
  const r = radius / screenScale;

  return `<circle id="${id}" cx="${x}" cy="${y}" r="${r}" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="${fill}" />`;
};

export const deserializer: XmlDeserializer = ({ xmlElementAttributes, screenScale = 1 }) => {
  const cx = extractNumericAttribute({ xmlElementAttributes, key: "@_cx" }) ?? 0 * screenScale;
  const cy = extractNumericAttribute({ xmlElementAttributes, key: "@_cy" }) ?? 0 * screenScale;
  const radius = extractNumericAttribute({ xmlElementAttributes, key: "@_r" }) ?? 0 * screenScale;
  const id = extractNumericAttribute({ xmlElementAttributes, key: "@_id" }) ?? 0;
  const strokeColor = extractColorAttribute({ xmlElementAttributes, key: "@_stroke" });
  const strokeWidth = extractNumericAttribute({ xmlElementAttributes, key: "@_stroke-width" }) ?? 0;
  const fill = extractColorAttribute({ xmlElementAttributes, key: "@_fill" });

  return {
    type: SvgElementType.circle,
    id,
    cx: cx * screenScale,
    cy: cy * screenScale,
    radius: radius * screenScale,
    strokeColor,
    strokeWidth,
    fill,
  };
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
