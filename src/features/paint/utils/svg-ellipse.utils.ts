import { SvgElementType, isEllipse } from "../types/svg.types";
import {
  XmlDeserializer,
  XmlSerializationHandler,
  XmlSerializer,
  extractColorAttribute,
  extractNumericAttribute,
} from "./svg-serialization.utils";

export const serializer: XmlSerializer = ({ element, screenScale = 1 }) => {
  if (!isEllipse(element)) {
    throw new Error(`Cannot serialize non-ellipse element: ${JSON.stringify(element)}`);
  }

  const { id, cx, cy, rx, ry, strokeColor = "none", strokeWidth = 0, fill = "none" } = element;
  const sCx = cx / screenScale;
  const sCy = cy / screenScale;
  const sRx = rx / screenScale;
  const sRy = ry / screenScale;

  return `<ellipse id="${id}" cx="${sCx}" cy="${sCy}" rx="${sRx}" ry="${sRy}" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="${fill}" />`;
};

export const deserializer: XmlDeserializer = ({ xmlElementAttributes, screenScale = 1 }) => {
  const cx = extractNumericAttribute({ xmlElementAttributes, key: "@_cx" }) ?? 0 * screenScale;
  const cy = extractNumericAttribute({ xmlElementAttributes, key: "@_cy" }) ?? 0 * screenScale;
  const rx = extractNumericAttribute({ xmlElementAttributes, key: "@_rx" }) ?? 0 * screenScale;
  const ry = extractNumericAttribute({ xmlElementAttributes, key: "@_ry" }) ?? 0 * screenScale;
  const id = extractNumericAttribute({ xmlElementAttributes, key: "@_id" }) ?? 0;
  const strokeColor = extractColorAttribute({ xmlElementAttributes, key: "@_stroke" });
  const strokeWidth = extractNumericAttribute({ xmlElementAttributes, key: "@_stroke-width" }) ?? 0;
  const fill = extractColorAttribute({ xmlElementAttributes, key: "@_fill" });

  return {
    type: SvgElementType.ellipse,
    id,
    cx: cx * screenScale,
    cy: cy * screenScale,
    rx: rx * screenScale,
    ry: ry * screenScale,
    strokeColor,
    strokeWidth,
    fill,
  };
};

export const ELLIPSE_SERIALIZER: XmlSerializationHandler = { serializer, deserializer };
