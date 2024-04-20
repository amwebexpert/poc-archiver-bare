import Reactotron from "reactotron-react-native";
import { ArgType } from "reactotron-core-client";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeModules } from "react-native";

Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({ name: "poc-archiver-bare" })
  .useReactNative({ asyncStorage: true })
  .setAsyncStorageHandler?.(AsyncStorage)
  .connect();

/**
 * Reactotron allows you to define custom commands that you can run
 * from Reactotron itself, and they will run in your app.
 *
 * Define them in the section below with `onCustomCommand`. Use your
 * creativity -- this is great for development to quickly and easily
 * get your app into the state you want.
 *
 * NOTE: If you edit this file while running the app, you will need to do a full refresh
 * or else your custom commands won't be registered correctly.
 */
Reactotron.onCustomCommand({
  title: "Show Dev Menu",
  description: "Opens the React Native developer menu",
  command: "showDevMenu",
  handler: () => NativeModules.DevMenu.show(),
});

Reactotron.onCustomCommand({
  title: "Log connected device info",
  description: "Dump device info to console",
  command: "logDeviceInfo",
  args: [{ name: "info", type: ArgType.String }],
  handler: (_args?: Record<string, string>) =>
    Reactotron.log("Device info", {
      deviceId: DeviceInfo.getDeviceId(),
      bundleId: DeviceInfo.getBundleId(),
      systemName: DeviceInfo.getSystemName(),
      systemVersion: DeviceInfo.getSystemVersion(),
      version: DeviceInfo.getVersion(),
      readableVersion: DeviceInfo.getReadableVersion(),
      buildNumber: DeviceInfo.getBuildNumber(),
      isTablet: DeviceInfo.isTablet(),
      isLowRamDevice: DeviceInfo.isLowRamDevice(),
      isDisplayZoomed: DeviceInfo.isDisplayZoomed(),
      appName: DeviceInfo.getApplicationName(),
      brand: DeviceInfo.getBrand(),
      model: DeviceInfo.getModel(),
      deviceType: DeviceInfo.getDeviceType(),
    }),
});
