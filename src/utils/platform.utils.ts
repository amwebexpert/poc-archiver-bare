import { Platform } from "react-native";

export const isAndroid = (): boolean => Platform.OS === "android";

export const isIOS = (): boolean => Platform.OS === "ios";

export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
