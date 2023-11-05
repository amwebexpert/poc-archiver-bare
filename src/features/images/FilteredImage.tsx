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

import { FilteringTypes } from "./Image.types";

type FilteredImageProps = PropsWithChildren<{
  filteringType?: FilteringTypes;
}>;

export const FilteredImage: FunctionComponent<FilteredImageProps> = ({ filteringType, children }) => {
  switch (filteringType) {
    case FilteringTypes.none:
      return <>{children}</>;

    case FilteringTypes.grayscale:
      return <Grayscale>{children}</Grayscale>;

    case FilteringTypes.sepiaWithTint:
      return <ColorMatrix matrix={concatColorMatrices(sepia(), tint(1.25))}>{children}</ColorMatrix>;

    case FilteringTypes.saturateWithContrast:
      return (
        <ColorMatrix matrix={concatColorMatrices(saturate(-0.9), contrast(5.2), invert())}>{children}</ColorMatrix>
      );

    default:
      return <>{children}</>;
  }
};
