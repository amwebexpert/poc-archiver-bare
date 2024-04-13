import { ColorValue, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedProps } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { SINGLE_TAP_MAX_DISTANCE } from "../constants";

import { FunctionComponent } from "react";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

type GesturePoints = {
  value: string[];
};

type PathGestureDrawerProps = {
  strokeColor?: ColorValue;
  strokeWidth?: number;
  fill?: ColorValue;
  addElementFromGesture?: (path: string) => void;
  gesturePoints: GesturePoints;
};

export const PathGestureDrawer: FunctionComponent<PathGestureDrawerProps> = ({
  strokeColor = "black",
  strokeWidth = 1,
  fill = "none",
  addElementFromGesture = () => {},
  gesturePoints = { value: [] },
}) => {
  const panGesture = Gesture.Pan()
    .minDistance(SINGLE_TAP_MAX_DISTANCE + 1)
    .onStart(({ x, y }) => {
      gesturePoints.value = [`M ${x},${y}`]; // M = "move to"
    })
    .onChange(({ x, y }) => {
      gesturePoints.value = [...gesturePoints.value, `L ${x},${y}`]; // L = "line to"
    })
    .onEnd((_event, _ctx) => runOnJS(addElementFromGesture)(gesturePoints.value.join(" ")));

  const tapGesture = Gesture.Tap()
    .maxDistance(SINGLE_TAP_MAX_DISTANCE)
    .onStart(({ x, y }) => {
      gesturePoints.value = [`M ${x},${y} L ${x},${y}`]; // M = "move to"
    })
    .onEnd((_event, _ctx) => runOnJS(addElementFromGesture)(gesturePoints.value.join(" ")));

  const animatedProps = useAnimatedProps(() => ({
    d: gesturePoints.value.join(),
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={Gesture.Race(tapGesture, panGesture)}>
        <Animated.View style={styles.container}>
          <AnimatedSvg height="100%" width="100%">
            <AnimatedPath animatedProps={animatedProps} fill={fill} stroke={strokeColor} strokeWidth={strokeWidth} />
          </AnimatedSvg>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
