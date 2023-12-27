import React, { PropsWithChildren } from "react";

// https://github.com/software-mansion/react-native-gesture-handler/issues/71#issuecomment-700609811
export class Ghost extends React.Component<PropsWithChildren> {
  render() {
    return this.props.children;
  }
}
