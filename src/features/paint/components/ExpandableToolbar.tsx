import { Children, FunctionComponent, PropsWithChildren, useState } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { AppTheme } from "../../../theme";

type ExpandableToolbarProps = PropsWithChildren & ViewProps;

const ICON_BUTTON_LAYOUT_WIDTH = 48;

export const ExpandableToolbar: FunctionComponent<ExpandableToolbarProps> = ({ children, ...rest }) => {
  const styles = useStyles();
  const [isExpanded, setIsExpanded] = useState(true);
  const count = Children.count(children);
  const toolbarWidth = count * ICON_BUTTON_LAYOUT_WIDTH;

  const expansion = useSharedValue(1);
  const width = useDerivedValue(() => toolbarWidth * expansion.value);
  const animatedStyles = useAnimatedStyle(() => ({ width: width.value }));

  const toggleExpansion = () => {
    const toValue = expansion.value ? 0 : 1;
    const shouldExpand = toValue === 1;
    expansion.value = shouldExpand ? withSpring(toValue) : withTiming(toValue, { duration: 400 });
    setIsExpanded(shouldExpand);
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

const useStyles = () => {
  const theme = useTheme() as AppTheme;

  return StyleSheet.create({
    expandToggleButton: {
      height: 32,
      width: 24,
      padding: 0,
      marginHorizontal: 0,
      borderColor: undefined,
    },
    fixedToolbarContainer: {
      flexDirection: "row",
      overflow: "hidden",
    },
  });
};
