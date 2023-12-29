import { View } from "react-native";

import { FunctionComponent } from "react";
import { Selector } from "./ElementsSelectorGesture/Selector";
import SvgViewer from "./SvgViewer/SvgViewer";
import { CanvasDimensions } from "./canvas.types";
import { DEFAULT_DIMENSIONS } from "./constants";
import { useSelectedElements } from "./hooks/useSelectedElement";
import paintStore from "./paint.store";
import { paintCommonStyles } from "./paint.styles";
import { SvgPathElement } from "./svg.types";

type SvgCanvasElementsStretcherModeProps = {
  canvasDimensions?: CanvasDimensions;
};

const SvgCanvasElementsStretcherMode: FunctionComponent<SvgCanvasElementsStretcherModeProps> = ({
  canvasDimensions = DEFAULT_DIMENSIONS,
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

export default SvgCanvasElementsStretcherMode;
