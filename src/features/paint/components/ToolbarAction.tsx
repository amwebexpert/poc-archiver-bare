import { FunctionComponent } from "react";
import { IconButton } from "react-native-paper";

type IconButtonProps = React.ComponentProps<typeof IconButton>;

export const ToolbarAction: FunctionComponent<IconButtonProps> = props => (
  <IconButton {...props} size={18} mode="contained" />
);
