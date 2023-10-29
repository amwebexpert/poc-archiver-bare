import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AboutScreen } from "../features/about/AboutScreen";
import { JailMonkeyScreen } from "../features/device-info/JailMonkeyScreen";
import { HomeScreen } from "../navigation/HomeScreen";

import OtherFeaturesScreen from "./OtherFeaturesScreen";
import DeviceInfoScreen from "../features/device-info/DeviceInfoScreen";

const Stack = createNativeStackNavigator();

// https://stackoverflow.com/a/69368480/704681
export type RootStackParamList = {
  Home: undefined;

  OtherDemos: undefined;
  JailMonkeyScreen: { id: number } | undefined;
  DeviceInfoScreen: undefined;

  About: undefined;
};

const MainNavigation = (): JSX.Element => {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen name="OtherDemos" component={OtherFeaturesScreen} />
      <Stack.Screen name="JailMonkeyScreen" component={JailMonkeyScreen} />
      <Stack.Screen name="DeviceInfoScreen" component={DeviceInfoScreen} />

      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigation;
