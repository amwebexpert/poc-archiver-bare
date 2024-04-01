import { format } from "date-fns";
import { Platform } from "react-native";
import { pick, types } from "react-native-document-picker";
import { DocumentDirectoryPath, DownloadDirectoryPath, exists } from "react-native-fs";
import { isAndroid } from "../../../utils/platform.utils";

export type PaintFile = {
  filename: string;
  fullFilename: string;
  fullFilenamePreview: string;
};

export const newPaintFile = (filePrefix: string): string => {
  const timestamp = format(new Date(), "yyyy-MM-dd-HH-mm-ss");
  const filename = `${filePrefix}-${timestamp}.svg`;
  const directory = Platform.OS === "ios" ? DocumentDirectoryPath : DownloadDirectoryPath;
  return `${directory}/${filename}`;
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

export const pickFile = async (): Promise<string> => {
  try {
    const [pickResult] = await pick({ type: types.allFiles, mode: "open" });
    const { uri, name } = pickResult;

    const fullFilename = isAndroid() ? await getAndroidDownloadPath(name ?? "") : getIosDocumentPath(uri);
    return fullFilename.endsWith(".png") ? fullFilename.replace(".png", ".svg") : fullFilename;
  } catch (error) {
    console.error("Error selecting file", error);
    return "";
  }
};

export const getIosDocumentPath = (uri: string): string => decodeURIComponent(uri).replace("file://", "");

export const getAndroidDownloadPath = async (name: string): Promise<string> => {
  const fullFilename = `${DownloadDirectoryPath}/${name}`;
  const isFileExists = await exists(fullFilename);

  if (!isFileExists) {
    throw new Error("Only supporting files from the download directory on Android.");
  }

  return fullFilename;
};
