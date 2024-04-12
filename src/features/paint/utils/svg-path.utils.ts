import pathParser from "parse-svg-path";
import simplify from "simplify-js";
import { SvgElementType, SvgPathElement, isPath } from "../types/svg.types";

import { DEFAULT_STROKE_COLOR, DEFAULT_STROKE_WIDTH, PathSimplificationConfigs } from "../constants";
import { XYCoordinates } from "../types/canvas.types";
import {
  XmlDeserializer,
  XmlSerializationHandler,
  XmlSerializer,
  extractNumericAttribute,
} from "./svg-serialization.utils";

export const serializer: XmlSerializer = ({ element, screenScale = 1 }) => {
  if (!isPath(element)) {
    throw new Error(`Cannot serialize non-path element: ${JSON.stringify(element)}`);
  }

  const { id, d, strokeColor, strokeWidth } = element;
  const normalizedPath = toDeviceIndependentPixel({ d, screenScale });

  return `<path id="${id}" d="${normalizedPath}" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="none" />`;
};

export const simplifyPath = ({
  d = "",
  tolerance = PathSimplificationConfigs.tolerance,
  highQuality = PathSimplificationConfigs.highQuality,
}): string => {
  const points = getPathPoints(d);
  const simplifiedPoints = simplify(points, tolerance, highQuality);

  return fromCoordinatesArray(simplifiedPoints);
};

// TODO AM rename toCoordinatesArray to match fromCoordinatesArray below
export const getPathPoints = (d = ""): XYCoordinates[] => {
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
  const strokeColor = xmlElementAttributes["@_stroke"];
  const strokeWidth = extractNumericAttribute({ xmlElementAttributes, key: "@_stroke-width" });

  return { type: SvgElementType.path, id, d, strokeColor, strokeWidth };
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

export const buildPathElement = ({
  d = "",
  strokeColor = DEFAULT_STROKE_COLOR,
  strokeWidth = DEFAULT_STROKE_WIDTH,
}): SvgPathElement => {
  const id = Date.now();
  const simplifiedPath = simplifyPath({ d });

  return {
    type: SvgElementType.path,
    d: simplifiedPath,
    strokeColor,
    strokeWidth,
    id,
  };
};
