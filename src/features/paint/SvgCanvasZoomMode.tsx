import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";

import { observer } from "mobx-react";
import { FunctionComponent } from "react";
import SvgViewer from "./components/SvgViewer/SvgViewer";
import paintStore from "./stores/paint.store";
import { ZoomPanInfoType } from "./stores/zoom-pan.store";
import { paintCommonStyles } from "./CanvasEdit.styles";

const SvgCanvasZoomMode: FunctionComponent<{}> = () => {
  const { elements } = paintStore;
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
      <SvgViewer elements={elements} />
    </ReactNativeZoomableView>
  );
};

export default observer(SvgCanvasZoomMode);
