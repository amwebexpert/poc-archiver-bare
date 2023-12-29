import { StyleSheet, View } from "react-native";

import { CanvasDimensions, DEFAULT_DIMENSIONS } from "./constants";
import { Selector } from "./ElementsSelectorGesture/Selector";
import { useSelectedElements } from "./hooks/useSelectedElement";
import SvgViewer from "./SvgViewer/SvgViewer";
import paintStore from "./paint.store";
import { FunctionComponent } from "react";
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
    <View style={[styles.container, { transform: [{ scale: zoomLevel }, { translateX }, { translateY }] }]}>
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

const styles = StyleSheet.create({
  container: {
    borderColor: "black",
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
  },
});

export default SvgCanvasElementsStretcherMode;
