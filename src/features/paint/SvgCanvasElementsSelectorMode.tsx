import { View } from "react-native";

import { FunctionComponent } from "react";
import SvgViewer from "./SvgViewer/SvgViewer";
import { useSelectedElements } from "./hooks/useSelectedElement";
import paintStore from "./paint.store";
import { paintCommonStyles } from "./paint.styles";

const SvgCanvasElementsSelectorMode: FunctionComponent<{}> = () => {
  const { zoomLevel, translateX, translateY } = paintStore.zoomAndPanInfo;
  const { elementsWithSelectedFlag } = useSelectedElements();

  return (
    <View style={[paintCommonStyles.container, { transform: [{ scale: zoomLevel }, { translateX }, { translateY }] }]}>
      <SvgViewer elements={elementsWithSelectedFlag} onElementPress={paintStore.selectElement} />
    </View>
  );
};

export default SvgCanvasElementsSelectorMode;
