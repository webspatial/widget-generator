This repo showes demostrate how to use WebSpatial SDK to produce a native AVP app.

## Development

```bash
pnpm install
npm run devAVP
npm run sim:dev
```

You can use Safari's Web Inspector to debug.

## Build for packaged production for AVP simulator (all web assets are included in the package)

**Prerequisite:**

- XCode 14.3
- VisionOS 2.5 Simulator installed

```
npm run build
npm run sim:distpkg

or
npm run build:sim:distpkg
```

The built app will be installed on your simulator.
The instalable app can be found in following path:

```
node_modules/.webspatial-builder-temp/platform-visionos/test/Build/Products/Debug-xrsimulator
```

You can share and install this app with your friends to run on their AVP simulator.

## Build for packaged production for physical AVP (all web assets are included in the package)

**Prerequisite:**

- XCode 14.3
- Knowledge of XCode Apple Developer Account Configuration
- copy .env to .env.local and configure APPLE_TEAM_ID and BUNDLE_ID
  -- You need APPLE_TEAM_ID to publish a visionOS app to App Store.
  -- the BUNDLE_ID should be unique

Step1: build web assets.
**Note:**

- you need to fill the teamId and change the bundleId in package.json
- the build result will be located at build folder

```
    "device-packaged": "npm run build && npx webspatial-builder build --base=/ --teamId= --bundle-id=",
```

run the following command to build for packaged production for AVP

```bash
npm run build
npm run ipa:distpkg

or
npm run build:ipa:distpkg
```

the .ipa file will be located at build folder

Step2: If you failed to build, you can try to build with XCode manually.

open XCode project located at `node_modules/.webspatial-builder-temp/platform-visionos/project/web-spatial.xcodeproj`

Step3: install the ipa file to your device.
