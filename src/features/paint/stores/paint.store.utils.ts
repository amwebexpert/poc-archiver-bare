import { format } from "date-fns";
import { Platform } from "react-native";
import { DocumentDirectoryPath, DownloadDirectoryPath } from "react-native-fs";

export type PaintFile = {
  filename: string;
  fullFilename: string;
  fullFilenamePreview: string;
};

export const newPaintFile = (filePrefix: string): PaintFile => {
  const timestamp = format(new Date(), "yyyy-MM-dd-HH-mm-ss");
  const filename = `${filePrefix}-${timestamp}.svg`;
  const directory = Platform.OS === "ios" ? DocumentDirectoryPath : DownloadDirectoryPath;
  const fullFilename = `${directory}/${filename}`;
  const fullFilenamePreview = fullFilename.replace(".svg", ".png");

  return {
    filename,
    fullFilename,
    fullFilenamePreview,
  };
};

export const parsePaintFile = (fullFilename: string): PaintFile => {
  const filename = fullFilename.split("/").pop() || "";
  const fullFilenamePreview = fullFilename.replace(".svg", ".png");

  return {
    filename,
    fullFilename,
    fullFilenamePreview,
  };
};
