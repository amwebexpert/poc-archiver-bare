import { FunctionComponent, useEffect, useState, ComponentProps } from "react";

import { FlashList } from "@shopify/flash-list";
import { StyleSheet, View } from "react-native";
import { SegmentedButtons, Text, useTheme } from "react-native-paper";

import { AppLayout } from "../../components/layout/AppLayout";
import { AppTheme } from "../../theme";
import { FilteringType, FilteringTypesKey, ImageItemType, buildSegmentedButtonsDisplayItems } from "./Image.types";
import { buildImagesList } from "./Image.utils";
import ImageItem from "./ImageItem";

const FastImageScreen: FunctionComponent = () => {
  const styles = useStyles();
  const [dataSource, setDataSource] = useState<ImageItemType[]>([]);
  const [filteringType, setFilteringType] = useState<FilteringType>(FilteringType.none);

  useEffect(() => setDataSource(buildImagesList(200)), []);

  return (
    <AppLayout title="FastImage screen">
      <View style={styles.root}>
        <Text variant="titleSmall" style={styles.title}>
          Unsplash images collection
        </Text>

        <SegmentedButtons
          value={filteringType}
          onValueChange={filteringType => setFilteringType(FilteringType[filteringType as FilteringTypesKey])}
          buttons={buildSegmentedButtonsDisplayItems()}
        />

        <View style={styles.listContainer}>
          <FlashList
            key={filteringType}
            data={dataSource}
            renderItem={({ item }) => <ImageItem item={item} filteringType={filteringType} />}
            numColumns={3}
            keyExtractor={item => `${item.id}`}
            estimatedItemSize={200}
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
      marginBottom: theme.spacing(1),
    },
    listContainer: {
      flex: 1,
      width: "100%",
      marginTop: theme.spacing(2),
    },
  });
};

export default FastImageScreen;
