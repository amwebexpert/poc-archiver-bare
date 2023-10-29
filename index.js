import "./src/utils/wdyr"; // <--- first import

import { AppRegistry } from "react-native";
import { startNetworkLogging } from "react-native-network-logger";

import { name as appName } from "./app.json";
import App from "./src/App";

startNetworkLogging();

AppRegistry.registerComponent(appName, () => App);
