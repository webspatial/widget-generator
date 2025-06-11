This repo showes demostrate how to use WebSpatial SDK to produce a native AVP app.

## Development

```bash
pnpm install
npm run devAVP
npm run sim
```

You can use Safari's Web Inspector to debug.

## Build for packaged production for AVP simulator (all web assets are included in the package)

**Prerequisite:**

- XCode 14.3
- VisionOS Simulator installed

```
npm run build-sim
```

The built app will be installed on your simulator.
The instalable app can be found in following path:

```
node_modules/.webspatial-builder-temp/platform-visionos/test/Build/Products/Debug-xrsimulator
```

You can share and install this app with your friends to run on their AVP simulator.
