import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { observer } from "mobx-react";
import { ThemeProvider as StyledThemeProvider } from "styled-components/native";

import { SnackbarProvider } from "./components/snack-bar/SnackbarProvider";
import AppNavigation from "./navigation/AppNavigation";
import { darkTheme, lightTheme } from "./theme";
import { setupLogBox } from "./utils/logger";
import settingsStore from "./features/settings/Settings.store";

setupLogBox();

const App: FunctionComponent = () => {
  console.info("App: render");
  const appTheme = settingsStore.darkMode ? darkTheme : lightTheme;

  return (
    <NavigationContainer theme={appTheme}>
      <PaperProvider theme={appTheme}>
        <StyledThemeProvider theme={appTheme}>
          <SnackbarProvider>
            <AppNavigation />
          </SnackbarProvider>
        </StyledThemeProvider>
      </PaperProvider>
    </NavigationContainer>
  );
};

export default observer(App);
