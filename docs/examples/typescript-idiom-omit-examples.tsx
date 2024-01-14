import React, { type FunctionComponent } from "react";
import { View } from "react-native";

type IconSize = "sm" | "md" | "lg" | "xl";

// equivalent to string since all items of IconSize are string
type ExtendedIconSizeWrongWayLoosingAutoComplete = IconSize | string;

type ExtendedIconSize = IconSize | Omit<string, IconSize>;

interface IMySuperComponentProps {
  size: ExtendedIconSize;
  size2?: ExtendedIconSizeWrongWayLoosingAutoComplete;
}

const MySuperComponent: FunctionComponent<IMySuperComponentProps> = ({ size }) => {
  return <View>{size}</View>;
};

export const App: FunctionComponent = ({}) => {
  return (
    <View>
      <MySuperComponent size="sm" size2="no-ide-auto-completion" />
      <MySuperComponent size="md" size2="no intellisence since that prop is a string" />
      <MySuperComponent size="freeValue" />
    </View>
  );
};
