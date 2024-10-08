import { View } from "react-native";

import { observer } from "mobx-react";
import { FunctionComponent } from "react";
import { paintCommonStyles } from "./CanvasEdit.styles";
import SvgViewer from "./components/SvgViewer/SvgViewer";
import paintStore from "./stores/paint.store";

const SvgCanvasElementsSelectorMode: FunctionComponent<{}> = () => {
  const { zoomLevel, translateX, translateY } = paintStore.zoomAndPanInfo;
  const { elements } = paintStore;

  return (
    <View style={[paintCommonStyles.container, { transform: [{ scale: zoomLevel }, { translateX }, { translateY }] }]}>
      <SvgViewer elements={elements} onElementPress={e => paintStore.selectElement(e)} />
    </View>
  );
};

export default observer(SvgCanvasElementsSelectorMode);
