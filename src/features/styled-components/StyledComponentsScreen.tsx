import { FunctionComponent } from "react";
import { Text } from "react-native-paper";

import { AppLayout } from "../../components/layout/AppLayout";
import { RootContainer, ScreenTitle } from "./StyledComponentsScreen.styles";

const StyledComponentsScreen: FunctionComponent = () => {
  return (
    <AppLayout title="Styled components">
      <RootContainer>
        <ScreenTitle>Styled</ScreenTitle>
      </RootContainer>
    </AppLayout>
  );
};

export default StyledComponentsScreen;
