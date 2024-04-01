# ReactNative (Bare) POCs

![GitHub release (latest by date)](https://img.shields.io/github/v/release/amwebexpert/poc-archiver-bare) ![GitHub Release Date](https://img.shields.io/github/release-date/amwebexpert/poc-archiver-bare) ![GitHub last commit](https://img.shields.io/github/last-commit/amwebexpert/poc-archiver-bare) ![GitHub](https://img.shields.io/github/license/amwebexpert/poc-archiver-bare)

## This app includes the following proof of concept

- `react-native-network-logger`
- `jail-monkey`
- `react-native-device-info`
- `react-native-date-picker`
- `react-native-email-link`
- `styled-components`
- `mobx-react`
- `axios`
- `@shopify/flash-list`
- `@react-native-clipboard/clipboard`
- `react-native-markdown-display`
- `react-native-document-picker`
- `react-native-document-fs`
- and many more...

## TODOs

- replace both `prettier` and `eslint` by [Biomejs](https://biomejs.dev/)
- inside the Paint demo:
  - have a vertical collapsible toolbar
  - horizontal scrollable tool icons
- upgrade dependencies to the latest stable versions like `react-native-svg` and `react-native-date-picker`

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

### Troubleshooting

#### `undefined method __apply_Xcode_12_5_M1_post_install_workaround'`

- https://stackoverflow.com/a/70073403/704681

#### `CocoaPods could not find compatible versions for pod xyz`

- https://stackoverflow.com/a/67027937/704681

#### `➜ Implicit dependency on target 'React-runtimescheduler' in project 'Pods' via options... in build setting 'OTHER_LDFLAGS`

- https://stackoverflow.com/a/67027937/704681
  - Delete cocoa pods cache: `rm -rf ~/Library/Caches/CocoaPods`
  - Delete the Pods folder and the `Podfile.lock` usually located in `<project_root>/ios`.
  - Reinstall pods: `pod update`
