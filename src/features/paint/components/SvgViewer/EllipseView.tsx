import { Ellipse } from "react-native-svg";

import { FunctionComponent } from "react";
import { DEFAULT_SELECTION_DASH_ARRAY } from "../../constants";
import { CircleViewProps } from "./CircleView";

export const SIMPLE_DOT_SELECTED_EXTRA_RADIUS = 5;

export type EllipseViewProps = Omit<CircleViewProps, "radius"> & {
  rx?: number;
  ry?: number;
};

export const EllipseView: FunctionComponent<EllipseViewProps> = ({
  cx = 0,
  cy = 0,
  rx = 0,
  ry = 0,
  strokeColor = "black",
  strokeWidth = 1,
  fill = "none",
  scale = 1,
  onPress,
  isSelected = false,
}) => (
  <Ellipse
    cx={cx}
    cy={cy}
    rx={rx}
    ry={ry}
    fill={fill}
    stroke={strokeColor}
    strokeWidth={strokeWidth}
    scale={scale}
    onPress={onPress}
    strokeDasharray={isSelected ? DEFAULT_SELECTION_DASH_ARRAY : undefined}
  />
);
