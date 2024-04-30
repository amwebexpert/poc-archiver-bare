import { StyleSheet, View } from "react-native";
import { GestureDetector, GestureType } from "react-native-gesture-handler";
import Animated, { SharedValue, useAnimatedStyle, useDerivedValue } from "react-native-reanimated";

import { FunctionComponent } from "react";
import { XYCoordinates } from "../../types/canvas.types";
import { computeMovableHandleSize } from "./selectorUtils";

const AnimatedView = Animated.createAnimatedComponent(View);

type MovableHandleProps = {
  position: SharedValue<XYCoordinates>;
  onDrag: GestureType;
};

export const MovableHandle: FunctionComponent<MovableHandleProps> = ({ position, onDrag }) => {
  const { halfCircleSize, circleSize } = computeMovableHandleSize();

  const circlePositionX = useDerivedValue(() => position.value.x - halfCircleSize);
  const circlePositionY = useDerivedValue(() => position.value.y - halfCircleSize);

  const circleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: circlePositionX.value }, { translateY: circlePositionY.value }],
  }));

  return (
    <GestureDetector gesture={onDrag}>
      <AnimatedView style={[styles.container, circleAnimatedStyle]}>
        <View style={[styles.circle, { borderRadius: halfCircleSize, height: circleSize, width: circleSize }]} />
      </AnimatedView>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  circle: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderColor: "black",
    borderWidth: StyleSheet.hairlineWidth,
  },
  container: {
    position: "absolute",
    zIndex: 1,
  },
});
