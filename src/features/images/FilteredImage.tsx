import React, { FunctionComponent, PropsWithChildren } from "react";
import {
  Grayscale,
  sepia,
  tint,
  ColorMatrix,
  concatColorMatrices,
  invert,
  contrast,
  saturate,
} from "react-native-color-matrix-image-filters";

import { FilteringType } from "./Image.types";

type FilteredImageProps = PropsWithChildren<{
  filteringType?: FilteringType;
}>;

export const FilteredImage: FunctionComponent<FilteredImageProps> = ({ filteringType, children }) => {
  switch (filteringType) {
    case FilteringType.none:
      return <>{children}</>;

    case FilteringType.grayscale:
      return <Grayscale>{children}</Grayscale>;

    case FilteringType.sepiaWithTint:
      return <ColorMatrix matrix={concatColorMatrices(sepia(), tint(1.25))}>{children}</ColorMatrix>;

    case FilteringType.saturateWithContrast:
      return (
        <ColorMatrix matrix={concatColorMatrices(saturate(-0.9), contrast(5.2), invert())}>{children}</ColorMatrix>
      );

    default:
      return <>{children}</>;
  }
};
