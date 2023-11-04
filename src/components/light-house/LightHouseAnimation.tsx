import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet } from "react-native";

export const LightHouseAnimation = () => {
  const source = require("./light-house.json");

  return <LottieView style={styles.animation} source={source} autoPlay loop />;
};

const styles = StyleSheet.create({
  animation: {
    flex: 1,
  },
});
