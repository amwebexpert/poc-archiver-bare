import React from "react";
import { StyleSheet } from "react-native";
import Svg from "react-native-svg";

import { SvgElement } from "../svg.types";
import { EmptyView } from "./EmptyView";
import { ELEMENT_VIEWERS } from "./constants";

type SvgViewerProps = {
  elements?: SvgElement[];
  onElementPress?: (element: SvgElement) => void;
};

const SvgViewer = React.forwardRef<Svg, SvgViewerProps>(({ elements = [], onElementPress }, ref) => (
  <Svg style={styles.container} height="100%" width="100%" ref={ref}>
    {elements.map(item => {
      const ElementViewer = ELEMENT_VIEWERS.get(item.type) ?? EmptyView;
      const onPress = onElementPress ? () => onElementPress(item) : undefined;

      return <ElementViewer key={item.id} {...item} onPress={onPress} />;
    })}
  </Svg>
));

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 5,
    position: "absolute",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: -1,
  },
});

SvgViewer.displayName = "SvgViewer";

export default SvgViewer;
