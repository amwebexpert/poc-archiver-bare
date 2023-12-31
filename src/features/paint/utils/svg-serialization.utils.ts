import { XMLParser } from "fast-xml-parser";

import { CANVAS_DIMENSIONS } from "../constants";

import { CIRCLE_SERIALIZER } from "./svg-circle.utils";
import { PATH_SERIALIZER } from "./svg-path.utils";
import { SvgElement, SvgElementType, XmlSerializationHandler } from "../types/svg.types";

type XmlAttributes = Record<string, string>;
type extractNumericAttributeParams<T extends XmlAttributes> = { xmlElementAttributes: T; key: keyof T };
export const extractNumericAttribute = <T extends XmlAttributes>({
  xmlElementAttributes,
  key,
}: extractNumericAttributeParams<T>): number | undefined => {
  return key in xmlElementAttributes ? Number(xmlElementAttributes[key]) : undefined;
};

const { width, height } = CANVAS_DIMENSIONS;
const DEFAULT_VIEW_BOX = `0 0 ${width} ${height}`;
const DEFAULT_ELEMENT_NOOP_SERIALIZER: XmlSerializationHandler = {
  serializer: () => "",
  deserializer: () => undefined,
};
const DEFAULT_XML_PARSER_OPTIONS = {
  ignoreAttributes: false,
  ignoreDeclaration: true,
  ignorePiTags: true,
  removeNSPrefix: true,
  commentPropName: "#comment",
  preserveOrder: true,
};
const XML_ELEMENT_ATTRIBUTES_KEY = ":@";

const SVG_ELEMENTS = new Map<SvgElementType, XmlSerializationHandler>([
  [SvgElementType.path, PATH_SERIALIZER],
  [SvgElementType.circle, CIRCLE_SERIALIZER],
]);

const svgWrapper = ({ content = "", viewBox = DEFAULT_VIEW_BOX }) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox=${viewBox}><desc>{serializerVersion: 1}</desc>${content}</svg>`;

type toSvgFormatProps = {
  elements?: SvgElement[];
  screenScale?: number;
};
export const toSvgFormat = ({ elements = [], screenScale = 1 }: toSvgFormatProps) => {
  const elementsCollection = elements ?? [];
  const serializedElements = elementsCollection.map(element => {
    const { serializer } = SVG_ELEMENTS.get(element.type) ?? DEFAULT_ELEMENT_NOOP_SERIALIZER;
    return serializer({ element, screenScale });
  });

  return svgWrapper({ content: serializedElements.join("\n") });
};

export const fromSvgFormat = ({ content = "", screenScale = 1 }): SvgElement[] => {
  const parser = new XMLParser(DEFAULT_XML_PARSER_OPTIONS);
  const result = parser.parse(content ?? "");

  if (!result || result.length === 0) {
    return [];
  }

  const [firstXmlElement] = result;
  if (!firstXmlElement || firstXmlElement.length === 0 || !firstXmlElement.svg) {
    return [];
  }

  const xmlElements: Record<string, string | Record<string, string>>[] = firstXmlElement.svg;
  const elements = xmlElements.map(xmlElement => {
    const type = getXMLElementName(xmlElement) as SvgElementType;
    const xmlElementAttributes = xmlElement[XML_ELEMENT_ATTRIBUTES_KEY] as Record<string, string>;
    const { deserializer } = SVG_ELEMENTS.get(type) ?? DEFAULT_ELEMENT_NOOP_SERIALIZER;

    return deserializer({ xmlElementAttributes, screenScale });
  });

  // return only elements that have been successfuly deserialized
  return elements.filter(element => !!element) as SvgElement[];
};

const getXMLElementName = (element: Record<string, string | Record<string, string>>) =>
  Object.keys(element).find(key => key !== XML_ELEMENT_ATTRIBUTES_KEY)!;
