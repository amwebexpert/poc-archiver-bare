import pathParser from "parse-svg-path";
import simplify from "simplify-js";
import { SvgElementType, SvgPathElement, isPath } from "../types/svg.types";

import { PathSimplificationConfigs } from "../constants";
import { XYCoordinates } from "../types/canvas.types";
import {
  XmlDeserializer,
  XmlSerializationHandler,
  XmlSerializer,
  extractColorAttribute,
  extractNumericAttribute,
} from "./svg-serialization.utils";

export const serializer: XmlSerializer = ({ element, screenScale = 1 }) => {
  if (!isPath(element)) {
    throw new Error(`Cannot serialize non-path element: ${JSON.stringify(element)}`);
  }

  const { id, d, strokeColor = "black", strokeWidth = 1, fill = "none" } = element;
  const normalizedPath = toDeviceIndependentPixel({ d, screenScale });

  return `<path id="${id}" d="${normalizedPath}" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="${fill}" />`;
};

export const simplifyPath = ({
  d = "",
  tolerance = PathSimplificationConfigs.tolerance,
  highQuality = PathSimplificationConfigs.highQuality,
}): string => {
  const points = toCoordinatesArray(d);
  const simplifiedPoints = simplify(points, tolerance, highQuality);

  return fromCoordinatesArray(simplifiedPoints);
};

export const toCoordinatesArray = (d = ""): XYCoordinates[] => {
  const path = normalizePath(d);
  return pathParser(path).map(([_command, x, y]) => ({ x, y }));
};

export const fromCoordinatesArray = (points: XYCoordinates[]): string => {
  "worklet";

  if (!points?.length) {
    return "";
  }

  const [firstPoint, ...restPoints] = points;
  const firstCommand = `M ${firstPoint.x} ${firstPoint.y}`;
  const restCommands = restPoints.map(({ x, y }) => `L ${x} ${y}`);

  return [firstCommand, ...restCommands].join(" ");
};

export const deserializer: XmlDeserializer = ({ xmlElementAttributes, screenScale = 1 }) => {
  const d = toDeviceDependentPixel({ d: xmlElementAttributes["@_d"], screenScale });
  const id = extractNumericAttribute({ xmlElementAttributes, key: "@_id" }) ?? 0;
  const strokeColor = extractColorAttribute({ xmlElementAttributes, key: "@_stroke" });
  const strokeWidth = extractNumericAttribute({ xmlElementAttributes, key: "@_stroke-width" }) ?? 0;
  const fill = extractColorAttribute({ xmlElementAttributes, key: "@_fill" });

  return { type: SvgElementType.path, id, d, strokeColor, strokeWidth, fill };
};

export const toDeviceIndependentPixel = ({ d = "", screenScale = 1 }) => applyScale({ d, scale: 1 / screenScale });
export const toDeviceDependentPixel = ({ d = "", screenScale = 1 }) => applyScale({ d, scale: screenScale });

export const applyScale = ({ d = "", scale = 1 }) => {
  const path = normalizePath(d);
  const commands = pathParser(path).map(([command, ...args]) => {
    const newArgs = args.map(arg => arg * scale);
    return [command, ...newArgs];
  });

  return commands
    .map(([command, ...args]) => `${command} ${args.join(" ")}`)
    .join(" ")
    .trim();
};

export const PATH_SERIALIZER: XmlSerializationHandler = { serializer, deserializer };

export const normalizePath = (d = "") => d?.trim().toUpperCase() ?? "";

export const buildPathElement = ({ d = "", strokeColor = "black", strokeWidth = 1, fill = "none" }): SvgPathElement => {
  const id = Date.now();
  const simplifiedPath = simplifyPath({ d });

  return {
    type: SvgElementType.path,
    d: simplifiedPath,
    strokeColor,
    strokeWidth,
    fill,
    id,
  };
};
