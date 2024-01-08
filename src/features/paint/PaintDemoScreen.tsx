import { FunctionComponent } from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import CanvasEdit from "./CanvasEdit";

const PaintDemoScreen: FunctionComponent = () => {
  return (
    <AppLayout title="Paint App demo">
      <CanvasEdit />
    </AppLayout>
  );
};

export default PaintDemoScreen;
