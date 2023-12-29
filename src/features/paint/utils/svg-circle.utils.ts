import pathParser from "parse-svg-path";

import { normalizePath } from "./svg-path.utils";
import {
  SvgCircleElement,
  SvgElementType,
  XmlDeserializer,
  XmlSerializationHandler,
  XmlSerializer,
} from "../types/svg.types";

export const serializer: XmlSerializer<SvgCircleElement> = ({ element, screenScale = 1 }) => {
  const { id, cx, cy, radius, strokeColor: stroke, strokeWidth: width, fill } = element;
  const x = cx / screenScale;
  const y = cy / screenScale;
  const r = radius / screenScale;

  return `<circle id="${id}" cx="${x}" cy="${y}" r="${r}" stroke="${stroke}" stroke-width="${width}" fill="${fill}" />`;
};

export const deserializer: XmlDeserializer<SvgCircleElement> = ({ xmlElementAttributes, screenScale = 1 }) => {
  const cx = Number(xmlElementAttributes["@_cx"]) * screenScale;
  const cy = Number(xmlElementAttributes["@_cy"]) * screenScale;
  const radius = Number(xmlElementAttributes["@_r"]) * screenScale;
  const id = Number(xmlElementAttributes["@_id"]);
  const strokeColor = xmlElementAttributes["@_stroke"];
  const strokeWidth = Number(xmlElementAttributes["@_stroke-width"]);
  const fill = xmlElementAttributes["@_fill"];

  return { type: SvgElementType.circle, id, cx, cy, radius, strokeColor, strokeWidth, fill };
};

export const CIRCLE_SERIALIZER: XmlSerializationHandler<SvgCircleElement> = { serializer, deserializer };

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
