import { FunctionComponent, useEffect, useState } from "react";

import { Alert, FlatList, Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import FastImage from "react-native-fast-image";

import { AppLayout } from "../../components/layout/AppLayout";
import { AppTheme } from "../../theme";

type ImageItem = { id: number; src: string };

const FastImageScreen: FunctionComponent = () => {
  const styles = useStyles();

  const [dataSource, setDataSource] = useState<ImageItem[]>([]);

  useEffect(() => {
    const items = Array.apply(null, Array(120)).map((_value, index) => ({
      id: index,
      src: "https://unsplash.it/400/400?image=" + (index + 1),
    }));
    setDataSource(items);
  }, []);

  const openImage = (imageURL: string) =>
    Linking.canOpenURL(imageURL).then(supported => {
      if (supported) {
        Linking.openURL(imageURL);
      } else {
        Alert.alert("Don't know how to open the following URI: \n\n" + imageURL);
      }
    });

  return (
    <AppLayout title="Settings screen">
      <View style={styles.root}>
        <Text variant="titleSmall" style={styles.title}>
          Unsplash images collection
        </Text>

        <View style={styles.listContainer}>
          <FlatList
            data={dataSource}
            renderItem={({ item }) => (
              <View style={styles.imageContainerStyle}>
                <TouchableOpacity key={item.id} style={styles.touchableOpacity} onPress={() => openImage(item.src)}>
                  <FastImage style={styles.imageStyle} source={{ uri: item.src }} />
                </TouchableOpacity>
              </View>
            )}
            numColumns={3}
            keyExtractor={(_item, index) => index.toString()}
          />
        </View>
      </View>
    </AppLayout>
  );
};

const useStyles = () => {
  const theme = useTheme() as AppTheme;

  return StyleSheet.create({
    root: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      marginBottom: theme.spacing(3),
    },
    touchableOpacity: {
      flex: 1,
    },
    listContainer: {
      flex: 1,
      width: "100%",
      marginBottom: theme.spacing(2),
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
    fullImageStyle: {
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "98%",
      resizeMode: "contain",
    },
  });
};

export default FastImageScreen;
