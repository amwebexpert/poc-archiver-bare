import { View } from "react-native";

import { observer } from "mobx-react";
import { FunctionComponent } from "react";
import { Selector } from "./components/ElementsSelectorGesture/Selector";
import SvgViewer from "./components/SvgViewer/SvgViewer";
import { CanvasDimensions } from "./types/canvas.types";
import { ZERO_DIMENSIONS } from "./constants";
import { useSelectedElements } from "./hooks/useSelectedElement";
import paintStore from "./stores/paint.store";
import { paintCommonStyles } from "./constants";
import { SvgPathElement } from "./types/svg.types";

type SvgCanvasElementsStretcherModeProps = {
  canvasDimensions?: CanvasDimensions;
};

const SvgCanvasElementsStretcherMode: FunctionComponent<SvgCanvasElementsStretcherModeProps> = ({
  canvasDimensions = ZERO_DIMENSIONS,
}) => {
  const { zoomLevel, translateX, translateY } = paintStore.zoomAndPanInfo;
  const { selectedElements, unselectedElements, originalBoundingBox, isBoundingBoxReady } = useSelectedElements();
  const [firstSelectedElement] = selectedElements;

  const onDrawElementUpdate = (d = "") => {
    const updatedElement = { ...firstSelectedElement, isSelected: false, d };
    paintStore.updateDrawElement(updatedElement);
  };

  return (
    <View style={[paintCommonStyles.container, { transform: [{ scale: zoomLevel }, { translateX }, { translateY }] }]}>
      {isBoundingBoxReady && (
        <Selector
          canvasDimensions={canvasDimensions}
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
