import React, { type FunctionComponent } from "react";
import { View } from "react-native";

type IconSize = "sm" | "md" | "lg" | "xl";

// equivalent to string since all items of IconSize are string
type ExtendedIconSizeWrongWayLoosingAutoComplete = IconSize | string;

type ExtendedIconSize = IconSize | Omit<string, IconSize>;
type LooseAutoComplete<T extends string> = T | Omit<string, T>;

interface IMySuperComponentProps {
  size: ExtendedIconSize;
  size2?: LooseAutoComplete<IconSize>;
  sizeWithoutAutoComplete?: ExtendedIconSizeWrongWayLoosingAutoComplete;
}

const MySuperComponent: FunctionComponent<IMySuperComponentProps> = ({ size }) => {
  return <View>{size}</View>;
};

export const App: FunctionComponent = ({}) => {
  return (
    <View>
      <MySuperComponent size="sm" size2="sm" sizeWithoutAutoComplete="no-ide-auto-completion" />
      <MySuperComponent size="md" size2="md" sizeWithoutAutoComplete="no intellisence since that prop is a string" />
      <MySuperComponent size="freeValue" />
    </View>
  );
};
