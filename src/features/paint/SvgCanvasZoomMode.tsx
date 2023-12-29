import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";

import { observer } from "mobx-react";
import SvgViewer from "./SvgViewer/SvgViewer";
import { useSelectedElements } from "./hooks/useSelectedElement";
import paintStore from "./paint.store";
import { paintCommonStyles } from "./paint.styles";
import { ZoomPanInfoType } from "./zoom-pan.store";

const SvgCanvasZoomMode = () => {
  const { elementsWithSelectedFlag } = useSelectedElements();
  const { zoomLevel, offsetX, offsetY } = paintStore.zoomAndPanInfo;

  const onZoomPanInfoUpdate = (newZoomPanInfo: ZoomPanInfoType) => {
    const { zoomAndPanInfo } = paintStore;
    zoomAndPanInfo.zoomLevel = newZoomPanInfo.zoomLevel;
    zoomAndPanInfo.offsetX = newZoomPanInfo.offsetX;
    zoomAndPanInfo.offsetY = newZoomPanInfo.offsetY;
    zoomAndPanInfo.translateX = newZoomPanInfo.translateX;
    zoomAndPanInfo.translateY = newZoomPanInfo.translateY;
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
      style={paintCommonStyles.container}>
      <SvgViewer elements={elementsWithSelectedFlag} />
    </ReactNativeZoomableView>
  );
};

export default observer(SvgCanvasZoomMode);
