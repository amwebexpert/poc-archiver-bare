import { Path } from "react-native-svg";

import { DEFAULT_SELECTION_DASH_ARRAY } from "../../constants";
import { FunctionComponent } from "react";

type PathViewProps = {
  d?: string;
  strokeColor?: string;
  strokeWidth?: number;
  scale?: number;
  onPress?: () => void;
  isSelected?: boolean;
};

export const PathView: FunctionComponent<PathViewProps> = ({
  d = "",
  strokeColor = "",
  strokeWidth = 1,
  scale = 1,
  onPress,
  isSelected = false,
}) => (
  <Path
    d={d}
    stroke={strokeColor}
    strokeWidth={strokeWidth}
    scale={scale}
    onPress={onPress}
    strokeDasharray={isSelected ? DEFAULT_SELECTION_DASH_ARRAY : undefined}
  />
);
