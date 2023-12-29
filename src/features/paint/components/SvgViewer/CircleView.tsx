import { Circle } from "react-native-svg";

import { DEFAULT_SELECTION_DASH_ARRAY, DEFAULT_STROKE_WIDTH } from "../../constants";
import { FunctionComponent } from "react";

export const SIMPLE_DOT_SELECTED_EXTRA_RADIUS = 5;

type CircleViewProps = {
  cx?: number;
  cy?: number;
  radius?: number;
  strokeColor?: string;
  strokeWidth?: number;
  scale?: number;
  onPress?: () => void;
  isSelected?: boolean;
};

export const CircleView: FunctionComponent<CircleViewProps> = ({
  cx = 0,
  cy = 0,
  radius = 0,
  strokeColor = "black",
  strokeWidth = 1,
  scale = 1,
  onPress,
  isSelected = false,
}) => {
  const hasStrokeWidth = strokeWidth > 0;
  const isSimpleDot = radius < 2 && !hasStrokeWidth;
  const isSimpleDotSelected = isSimpleDot && isSelected;

  return (
    <Circle
      cx={cx}
      cy={cy}
      r={isSimpleDotSelected ? radius + SIMPLE_DOT_SELECTED_EXTRA_RADIUS : radius}
      fill={isSimpleDotSelected ? "transparent" : strokeColor}
      stroke={strokeColor}
      strokeWidth={isSelected && !hasStrokeWidth ? DEFAULT_STROKE_WIDTH : strokeWidth}
      scale={scale}
      onPress={onPress}
      strokeDasharray={isSelected ? DEFAULT_SELECTION_DASH_ARRAY : undefined}
    />
  );
};
