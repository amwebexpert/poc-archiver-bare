# ReactNative (Bare) POCs

![GitHub release (latest by date)](https://img.shields.io/github/v/release/amwebexpert/poc-archiver-bare) ![GitHub Release Date](https://img.shields.io/github/release-date/amwebexpert/poc-archiver-bare) ![GitHub last commit](https://img.shields.io/github/last-commit/amwebexpert/poc-archiver-bare) ![GitHub](https://img.shields.io/github/license/amwebexpert/poc-archiver-bare)

## This app includes the following proof of concept

- `@react-native-clipboard/clipboard`
- `@shopify/flash-list`
- `axios`
- `jail-monkey`
- `mobx-react`
- `react-native-date-picker`
- `react-native-device-info`
- `react-native-document-fs`
- `react-native-document-picker`
- `react-native-email-link`
- `react-native-markdown-display`
- `react-native-network-logger`
- `react-native-wheel-color-picker`
- `styled-components`
- and many more...

## TODOs

- replace both `prettier` and `eslint` by [Biomejs](https://biomejs.dev/)
- support additional svg element types:
  - polygon (ex: triangle <polygon points="100,10 150,190 50,190" ... />)
  - rect
  - line
  - polyline
  - text
- implement add the `redo` feature
- implement multiple items selection mode
- implement fill color
- implement brush size selector
- implement move to back and move to front

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

### Reactotron integration

#### Android usefull instructions and commands

- connect device with usbc cable
- `adb devices`
- `adb reverse tcp:9090 tcp:9090`
- `adb logcat -s ReactNativeJS` to see console.log of reanimated `worklet`

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

### References links

#### Upgrading RN

- https://reactnative.dev/docs/upgrading
- `npx react-native upgrade`
- https://github.com/pmadruga/react-native-clean-project
- https://react-native-community.github.io/upgrade-helper/?from=0.73.1&to=0.73.6
