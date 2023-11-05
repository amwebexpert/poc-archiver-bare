import { Alert, Linking } from "react-native";

const UNSPLASH_BASE_URL = "https://unsplash.it/400/400";

export const buildImagesList = (count = 10) => {
  const items = Array.apply(null, Array(count));

  return items.map((_value, index) => ({
    id: index,
    src: `${UNSPLASH_BASE_URL}?image=${index + 1}`,
  }));
};
