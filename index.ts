import { AppRegistry } from "react-native";
import { startNetworkLogging } from "react-native-network-logger";

import { name as appName } from "./app.json";
import App from "./src/App";

if (__DEV__) {
  require("./src/utils/reactotron/reactotron-config");
}

startNetworkLogging();

AppRegistry.registerComponent(appName, () => App);
