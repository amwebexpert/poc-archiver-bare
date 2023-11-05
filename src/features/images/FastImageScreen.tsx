import { FunctionComponent, useEffect, useState } from "react";

import { FlatList, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

import { AppLayout } from "../../components/layout/AppLayout";
import { AppTheme } from "../../theme";
import { ImageItemType } from "./Image.types";
import { buildImagesList } from "./Image.utils";
import ImageItem from "./ImageItem";

const FastImageScreen: FunctionComponent = () => {
  const styles = useStyles();
  const [dataSource, setDataSource] = useState<ImageItemType[]>([]);

  useEffect(() => setDataSource(buildImagesList(200)), []);

  return (
    <AppLayout title="Settings screen">
      <View style={styles.root}>
        <Text variant="titleSmall" style={styles.title}>
          Unsplash images collection
        </Text>

        <View style={styles.listContainer}>
          <FlatList
            data={dataSource}
            renderItem={({ item }) => <ImageItem item={item} />}
            numColumns={3}
            keyExtractor={item => `${item.id}`}
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
    listContainer: {
      flex: 1,
      width: "100%",
      marginBottom: theme.spacing(2),
    },
  });
};

export default FastImageScreen;
