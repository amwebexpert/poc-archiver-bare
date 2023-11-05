import React, { FunctionComponent } from "react";
import { Alert, Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import { ImageItemType } from "./Image.types";

type ImageItemProps = {
  item: ImageItemType;
};

const ImageItem: FunctionComponent<ImageItemProps> = ({ item }) => {
  const { id, src } = item;

  return (
    <View style={styles.imageContainerStyle}>
      <TouchableOpacity
        key={id}
        style={styles.touchableOpacity}
        onPress={() => Linking.openURL(src)}
        onLongPress={() => Alert.alert("aaa")}>
        <FastImage style={styles.imageStyle} source={{ uri: src }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  touchableOpacity: {
    flex: 1,
  },
  imageContainerStyle: {
    flex: 1,
    flexDirection: "column",
    margin: 1,
  },
  imageStyle: {
    height: 120,
    width: "100%",
  },
});

export default React.memo(ImageItem);
