import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NetworkLogger from "react-native-network-logger";

import { AboutScreen } from "../features/about/AboutScreen";
import { JailMonkeyScreen } from "../features/device-info/JailMonkeyScreen";
import { HomeScreen } from "./HomeScreen";

import DeviceInfoScreen from "../features/device-info/DeviceInfoScreen";
import SettingsScreen from "../features/settings/SettingsScreen";
import StoreDemoScreen from "../features/store-demo/StoreDemoScreen";
import OtherFeaturesScreen from "./OtherFeaturesScreen";
import StorageManagementScreen from "./StorageManagementScreen";

const Stack = createNativeStackNavigator();
const NetworkLoggerScreen = () => <NetworkLogger theme="dark" />;

// https://stackoverflow.com/a/69368480/704681
export type RootStackParamList = {
  Home: undefined;

  StorageManagementScreen: undefined;
  StoreDemoScreen: undefined;

  MiscellaneousFeaturesScreen: undefined;
  JailMonkeyScreen: { id: number } | undefined;
  DeviceInfoScreen: undefined;
  NetworkLoggerScreen: undefined;

  SettingsScreen: undefined;
  About: undefined;
};

const AppNavigation = (): JSX.Element => {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen name="StorageManagementScreen" component={StorageManagementScreen} />
      <Stack.Screen name="StoreDemoScreen" component={StoreDemoScreen} />

      <Stack.Screen name="MiscellaneousFeaturesScreen" component={OtherFeaturesScreen} />
      <Stack.Screen name="JailMonkeyScreen" component={JailMonkeyScreen} />
      <Stack.Screen name="DeviceInfoScreen" component={DeviceInfoScreen} />
      <Stack.Screen name="NetworkLoggerScreen" component={NetworkLoggerScreen} />

      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />

      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigation;
