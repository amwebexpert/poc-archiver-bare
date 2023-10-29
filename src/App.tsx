import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";

import { SnackbarProvider } from "./components/snack-bar/SnackbarProvider";
import AppNavigation from "./navigation/AppNavigation";
import { appTheme } from "./theme";
import { setupLogBox } from "./utils/logger";

setupLogBox();

const App = (): JSX.Element => {
  console.info("App: render");

  return (
    <NavigationContainer theme={appTheme}>
      <PaperProvider theme={appTheme}>
        <SnackbarProvider>
          <AppNavigation />
        </SnackbarProvider>
      </PaperProvider>
    </NavigationContainer>
  );
};

export default App;
