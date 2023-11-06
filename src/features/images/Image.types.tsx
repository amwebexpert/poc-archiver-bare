import { ComponentProps } from "react";
import { SegmentedButtons } from "react-native-paper";

export type ImageItemType = {
  id: number;
  src: string;
};

export enum FilteringType {
  none = "none",
  grayscale = "grayscale",
  sepiaWithTint = "sepiaWithTint",
  saturateWithContrast = "saturateWithContrast",
}

export type FilteringTypesDisplayItem = {
  label: FilteringType;
  value: FilteringType;
};

export type FilteringTypesKey = keyof typeof FilteringType;

export const buildSegmentedButtonsDisplayItems = (): FilteringTypesDisplayItem[] => {
  const keys = Object.keys(FilteringType) as FilteringTypesKey[];

  return keys.map(key => ({ value: FilteringType[key], label: FilteringType[key] }));
};
