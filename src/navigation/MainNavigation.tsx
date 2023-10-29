import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AboutScreen } from "../features/about/AboutScreen";
import { DeviceInfoScreen } from "../features/device-info/DeviceInfoScreen";
import { HomeScreen } from "../navigation/HomeScreen";

import OtherFeaturesScreen from "./OtherFeaturesScreen";

const Stack = createNativeStackNavigator();

// https://stackoverflow.com/a/69368480/704681
export type RootStackParamList = {
  Home: undefined;

  OtherDemos: undefined;
  DeviceInfo: { id: number } | undefined;

  About: undefined;
};

const MainNavigation = (): JSX.Element => {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen name="OtherDemos" component={OtherFeaturesScreen} />
      <Stack.Screen name="DeviceInfo" component={DeviceInfoScreen} />

      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigation;
