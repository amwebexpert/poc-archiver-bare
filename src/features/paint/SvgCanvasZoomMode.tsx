import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { StyleSheet } from "react-native";

import { useSelectedElements } from "./hooks/useSelectedElement";
import SvgViewer from "./SvgViewer/SvgViewer";
import paintStore, { ZoomPanInfoType } from "./paint.store";

const SvgCanvasZoomMode = () => {
  const { elementsWithSelectedFlag } = useSelectedElements();
  const { zoomLevel, offsetX, offsetY } = paintStore.zoomAndPanInfo;

  const onZoomPanInfoUpdate = (zoomPanInfo: ZoomPanInfoType) => {
    const { zoomLevel, offsetX, offsetY, translateX, translateY } = zoomPanInfo;
    paintStore.zoomAndPanInfo = { zoomLevel, offsetX, offsetY, translateX, translateY };
  };

  return (
    <ReactNativeZoomableView
      zoomEnabled={true}
      disablePanOnInitialZoom={false}
      initialZoom={zoomLevel}
      initialOffsetX={offsetX}
      initialOffsetY={offsetY}
      minZoom={0.5}
      maxZoom={5}
      // disable double tap when zoomLevel < 1 because zoomer animations are not smooth enough
      doubleTapDelay={zoomLevel > 1 ? 400 : 0}
      zoomStep={0.25}
      bindToBorders={true}
      onTranslateXY={onZoomPanInfoUpdate}
      style={styles.container}>
      <SvgViewer elements={elementsWithSelectedFlag} />
    </ReactNativeZoomableView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: "black",
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
  },
});

export default SvgCanvasZoomMode;
