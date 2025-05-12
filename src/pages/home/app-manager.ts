import { onCloseAppMessage } from "@/lib/channel-message";

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

    const windowProxy = window.open(`${url}?${urlParams}`);
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
