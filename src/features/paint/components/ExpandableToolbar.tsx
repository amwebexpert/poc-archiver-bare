import { FunctionComponent, PropsWithChildren, useState } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { IconButton } from "react-native-paper";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

type ExpandableToolbarProps = PropsWithChildren<{ fullWidth?: number }> & ViewProps;

export const ExpandableToolbar: FunctionComponent<ExpandableToolbarProps> = ({ children, fullWidth = 0, ...rest }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const expansion = useSharedValue(1);
  const animatedStyles = useAnimatedStyle(() => ({
    width: fullWidth * expansion.value,
  }));

  const toggleExpansion = () => {
    const toValue = expansion.value === 1 ? 0 : 1;
    const expand = toValue === 1;
    expansion.value = expand ? withSpring(toValue) : withTiming(toValue, { duration: 400 });
    setIsExpanded(expand);
  };

  return (
    <View {...rest}>
      <IconButton
        icon={isExpanded ? "chevron-right" : "chevron-left"}
        mode="outlined"
        onPress={toggleExpansion}
        style={styles.expandToggleButton}
      />
      <Animated.View style={[styles.fixedToolbarContainer, animatedStyles]}>{children}</Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  expandToggleButton: {
    backgroundColor: "black",
    borderRadius: 4,
    height: "100%",
    marginLeft: 8,
    width: 24,
  },
  fixedToolbarContainer: {
    flexDirection: "row",
    overflow: "hidden",
  },
});
