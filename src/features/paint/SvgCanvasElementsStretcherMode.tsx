import { View } from "react-native";

import { observer } from "mobx-react";
import { FunctionComponent } from "react";
import { paintCommonStyles } from "./CanvasEdit.styles";
import { Selector } from "./components/ElementsSelectorGesture/selector";
import SvgViewer from "./components/SvgViewer/SvgViewer";
import paintStore from "./stores/paint.store";
import { SvgElement } from "./types/svg.types";

const SvgCanvasElementsStretcherMode: FunctionComponent = ({}) => {
  const { zoomLevel, translateX, translateY } = paintStore.zoomAndPanInfo;
  const { selectedElements, unselectedElements, selectionBoundingBox } = paintStore;

  const [firstSelectedElement] = selectedElements;

  const onDrawElementUpdate = (updatedElement: SvgElement) => paintStore.updateDrawElement(updatedElement);

  return (
    <View style={[paintCommonStyles.container, { transform: [{ scale: zoomLevel }, { translateX }, { translateY }] }]}>
      <Selector
        originalBoundingBox={selectionBoundingBox}
        selectedElement={firstSelectedElement} // TODO: support multiple elements
        onDrawElementUpdate={onDrawElementUpdate} // TODO: support multiple elements
      />

      <SvgViewer elements={unselectedElements} />
    </View>
  );
};

export default observer(SvgCanvasElementsStretcherMode);
