import { StyleSheet, View } from "react-native";

import { useSelectedElements } from "./hooks/useSelectedElement";
import SvgViewer from "./SvgViewer/SvgViewer";
import paintStore from "./Paint.store";
import { FunctionComponent } from "react";

const SvgCanvasElementsSelectorMode: FunctionComponent<{}> = () => {
  const { zoomLevel, translateX, translateY } = paintStore.zoomAndPanInfo;
  const { elementsWithSelectedFlag } = useSelectedElements();

  return (
    <View style={[styles.container, { transform: [{ scale: zoomLevel }, { translateX }, { translateY }] }]}>
      <SvgViewer elements={elementsWithSelectedFlag} onElementPress={paintStore.selectElement} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: "black",
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
  },
});

export default SvgCanvasElementsSelectorMode;
