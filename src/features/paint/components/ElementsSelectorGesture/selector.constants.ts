import { View } from "react-native";
import Animated from "react-native-reanimated";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";

export const AnimatedView = Animated.createAnimatedComponent(View);
export const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export const AnimatedPath = Animated.createAnimatedComponent(Path);
export const AnimatedCircle = Animated.createAnimatedComponent(Circle);
export const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
