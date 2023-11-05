export type ImageItemType = {
  id: number;
  src: string;
};

export enum FilteringTypes {
  none = "none",
  grayscale = "grayscale",
  sepiaWithTint = "sepiaWithTint",
  saturateWithContrast = "saturateWithContrast",
}
