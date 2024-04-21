import { useWindowDimensions } from "react-native";
import { Portal } from "react-native-paper";
import Svg, { G, Rect } from "react-native-svg";

import { DEFAULT_CANVAS_DIMENSIONS } from "../../constants";

import { FunctionComponent } from "react";
import { SvgElement } from "../../types/svg.types";
import { EmptyView } from "./EmptyView";
import { ELEMENT_VIEWERS } from "./constants";
import { isIOS } from "../../../../utils/platform.utils";

type SvgSnapshotProps = {
  elements?: SvgElement[];
  scale?: number;
  onBase64Generated?: (base64: string) => void;
};

const SvgSnapshot: FunctionComponent<SvgSnapshotProps> = ({
  elements = [],
  scale = 1,
  onBase64Generated = () => {},
}) => {
  const { width } = useWindowDimensions();
  const offScreenStyle = { left: width };

  // as soon as we have a ref to the generated svg, we can take a
  // snapshot and callback onBase64Generated with the result
  const onRefUpdate = (ref: Svg) => {
    if (isIOS()) {
      // Dont know why if we do not log this, the ref does not get updated
      console.log("====>>> onRefUpdate", { elements: elements.length, scale, width: ref?.props.width });
    }
    ref?.toDataURL(onBase64Generated, DEFAULT_CANVAS_DIMENSIONS);
  };

  return (
    <Portal>
      <Svg style={offScreenStyle} height="100%" width="100%" ref={onRefUpdate}>
        <Rect x="0" y="0" height="100%" width="100%" stroke="black" strokeWidth="4" fill="white" />

        <G scale={scale}>
          {elements.map(item => {
            const ElementViewer = ELEMENT_VIEWERS.get(item.type) ?? EmptyView;
            return <ElementViewer key={item.id} {...item} />;
          })}
        </G>
      </Svg>
    </Portal>
  );
};

export default SvgSnapshot;
