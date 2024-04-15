import { View } from "react-native";

import { observer } from "mobx-react";
import { FunctionComponent } from "react";
import { paintCommonStyles } from "./CanvasEdit.styles";
import { Selector } from "./components/ElementsSelectorGesture/selectors/Selector";
import SvgViewer from "./components/SvgViewer/SvgViewer";
import { useSelectedElements } from "./hooks/useSelectedElement";
import paintStore from "./stores/paint.store";
import { SvgElement, SvgPathElement } from "./types/svg.types";

const SvgCanvasElementsStretcherMode: FunctionComponent = ({}) => {
  const { zoomLevel, translateX, translateY } = paintStore.zoomAndPanInfo;

  const { selectedElements, unselectedElements, originalBoundingBox, isBoundingBoxReady, hasSingleSelectedPath } =
    useSelectedElements();
  const [firstSelectedElement] = selectedElements;
  const showSelector = isBoundingBoxReady && hasSingleSelectedPath;

  const onDrawElementUpdate = (updatedElement: SvgElement) => paintStore.updateDrawElement(updatedElement);

  return (
    <View style={[paintCommonStyles.container, { transform: [{ scale: zoomLevel }, { translateX }, { translateY }] }]}>
      {showSelector && (
        <Selector
          originalBoundingBox={originalBoundingBox!}
          selectedElement={firstSelectedElement as unknown as SvgPathElement} // TODO: support multiple elements
          onDrawElementUpdate={onDrawElementUpdate} // TODO: support multiple elements
        />
      )}

      <SvgViewer elements={unselectedElements} />
    </View>
  );
};

export default observer(SvgCanvasElementsStretcherMode);
