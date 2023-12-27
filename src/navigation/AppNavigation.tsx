import { FunctionComponent } from "react";
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
import StyledComponentsScreen from "../features/styled-components/StyledComponentsScreen";
import ClipboardScreen from "../features/clipboard/ClipboardScreen";
import NetInfoScreen from "../features/netinfo/NetInfoScreen";
import DatePickerScreen from "../features/datepicker/DatePickerScreen";
import EmailerScreen from "../features/email/EmailerScreen";
import ImagesFeaturesScreen from "./ImageFeaturesScreen";
import FastImageScreen from "../features/images/FastImageScreen";
import AnimationFeaturesScreen from "./AnimationFeaturesScreen";

const Stack = createNativeStackNavigator();
const NetworkLoggerScreen = () => <NetworkLogger theme="dark" />;

export enum AppScreens {
  Home = "Home",

  StorageManagementScreen = "StorageManagementScreen",
  StoreDemoScreen = "StoreDemoScreen",

  ImageFeaturesScreen = "ImageFeaturesScreen",
  FastImageScreen = "FastImageScreen",

  MiscellaneousFeaturesScreen = "MiscellaneousFeaturesScreen",
  JailMonkeyScreen = "JailMonkeyScreen",
  DeviceInfoScreen = "DeviceInfoScreen",
  NetworkLoggerScreen = "NetworkLoggerScreen",
  StyledComponentsScreen = "StyledComponentsScreen",
  ClipboardScreen = "ClipboardScreen",
  NetInfoScreen = "NetInfoScreen",
  DatePickerScreen = "DatePickerScreen",
  EmailerScreen = "EmailerScreen",

  AnimationFeaturesScreen = "AnimationFeaturesScreen",
  DrawerScreen = "DrawerScreen",

  SettingsScreen = "SettingsScreen",
  About = "About",
}

// https://stackoverflow.com/a/69368480/704681
export type RootStackParamList = {
  [AppScreens.Home]: undefined;

  [AppScreens.StorageManagementScreen]: undefined;
  [AppScreens.StoreDemoScreen]: undefined;

  [AppScreens.ImageFeaturesScreen]: undefined;
  [AppScreens.FastImageScreen]: undefined;

  [AppScreens.MiscellaneousFeaturesScreen]: undefined;
  [AppScreens.JailMonkeyScreen]: undefined;
  [AppScreens.DeviceInfoScreen]: undefined;
  [AppScreens.NetworkLoggerScreen]: undefined;
  [AppScreens.StyledComponentsScreen]: undefined;
  [AppScreens.ClipboardScreen]: undefined;
  [AppScreens.NetInfoScreen]: undefined;
  [AppScreens.DatePickerScreen]: undefined;
  [AppScreens.EmailerScreen]: undefined;

  [AppScreens.AnimationFeaturesScreen]: undefined;
  [AppScreens.DrawerScreen]: undefined;

  [AppScreens.SettingsScreen]: undefined;
  [AppScreens.About]: undefined;
};

const AppNavigation: FunctionComponent = () => {
  return (
    <Stack.Navigator initialRouteName={AppScreens.Home} screenOptions={{ headerShown: true }}>
      <Stack.Screen name={AppScreens.Home} component={HomeScreen} />

      <Stack.Screen name={AppScreens.StorageManagementScreen} component={StorageManagementScreen} />
      <Stack.Screen name={AppScreens.StoreDemoScreen} component={StoreDemoScreen} />

      <Stack.Screen name={AppScreens.ImageFeaturesScreen} component={ImagesFeaturesScreen} />
      <Stack.Screen name={AppScreens.FastImageScreen} component={FastImageScreen} />

      <Stack.Screen name={AppScreens.MiscellaneousFeaturesScreen} component={OtherFeaturesScreen} />
      <Stack.Screen name={AppScreens.JailMonkeyScreen} component={JailMonkeyScreen} />
      <Stack.Screen name={AppScreens.DeviceInfoScreen} component={DeviceInfoScreen} />
      <Stack.Screen name={AppScreens.NetworkLoggerScreen} component={NetworkLoggerScreen} />
      <Stack.Screen name={AppScreens.StyledComponentsScreen} component={StyledComponentsScreen} />
      <Stack.Screen name={AppScreens.ClipboardScreen} component={ClipboardScreen} />
      <Stack.Screen name={AppScreens.NetInfoScreen} component={NetInfoScreen} />
      <Stack.Screen name={AppScreens.DatePickerScreen} component={DatePickerScreen} />
      <Stack.Screen name={AppScreens.EmailerScreen} component={EmailerScreen} />

      <Stack.Screen name={AppScreens.AnimationFeaturesScreen} component={AnimationFeaturesScreen} />

      <Stack.Screen name={AppScreens.SettingsScreen} component={SettingsScreen} />

      <Stack.Screen name={AppScreens.About} component={AboutScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigation;
