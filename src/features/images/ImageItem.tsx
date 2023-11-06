import { FunctionComponent, memo, useState } from "react";
import { Alert, Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import { FilteredImage } from "./FilteredImage";
import { FilteringType, ImageItemType } from "./Image.types";

type ImageItemProps = {
  item: ImageItemType;
  filteringType?: FilteringType;
};

const ImageItem: FunctionComponent<ImageItemProps> = ({ item, filteringType }) => {
  const { id, src } = item;

  return (
    <View style={styles.imageContainerStyle}>
      <TouchableOpacity
        key={id}
        style={styles.touchableOpacity}
        onPress={() => Linking.openURL(src)}
        onLongPress={() => Alert.alert("aaa")}>
        <FilteredImage filteringType={filteringType}>
          <FastImage style={styles.imageStyle} source={{ uri: src }} />
        </FilteredImage>
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

export default memo(ImageItem);
