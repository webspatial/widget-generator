import { onCloseAppMessage } from "@/lib/channel-message";
import {initScene, WindowContainerOptions} from "@webspatial/react-sdk"

export enum AppType {
  Clock = "clock",
  Weather = "weather",
  Whiteboard = "whiteboard",
  Home = "home",
}

const AppURL = {
  [AppType.Clock]: "/src/pages/clock/index.html",
  [AppType.Weather]: "/src/pages/weather/index.html",
  [AppType.Whiteboard]: "/src/pages/whiteboard/index.html",
  [AppType.Home]: "/index.html",
};

const AppDefaultSize: Record<string, WindowContainerOptions> = {
  [AppType.Clock]: {
    defaultSize: {
      width: 402,
      height: 456,
    },
     resizability: {
      minWidth: 402,
      minHeight: 456,
      maxWidth: 402,
      maxHeight: 456,
     }
  },
  [AppType.Weather]: {
    defaultSize: {
      width: 456,
      height: 438,
    },
    resizability: {
      minWidth: 456,
      minHeight: 438,
      maxWidth: 456,
      maxHeight: 438,
     }
  },
  [AppType.Whiteboard]: {
    defaultSize: {
      width: 700,
      height: 736,
    },
    resizability: {
      minWidth: 700,
      minHeight: 736,
      maxWidth: 700,
      maxHeight: 736,
     }
  },
  [AppType.Home]: {
    defaultSize: {
      width: 600,
      height: 610,
    },
    resizability: {
      minWidth: 600,
      minHeight: 610,
      maxWidth: 600,
      maxHeight: 610,
     }
  },
};

class AppManager {
  private _appList: WindowProxy[] = Array<WindowProxy>();

  constructor() {
    onCloseAppMessage(() => {
      this.closeAllApps();
    });
  }

  createApp(appType: AppType, params: Record<string, string>) {
    let url = AppURL[appType];
    let urlParams = "";
    // make params to url params
    for (const key in params) {
      urlParams += `${key}=${params[key]}&`;
    }

    const randomSceneName = new Date().getTime().toString(36) +  Math.random().toString(36).substring(2, 15);
    initScene(randomSceneName,   (_) =>  (AppDefaultSize[appType]))

    const windowProxy = window.open(`${url}?${urlParams}`, randomSceneName);
    if (windowProxy) {
      this._appList.push(windowProxy);
    } else {
      console.error("Failed to open window");
    }
  }

  closeAllApps() {
    this._appList.forEach((windowProxy) => {
      windowProxy.close();
    });
    this._appList = [];
  }
}

export const gAppManager = new AppManager();
