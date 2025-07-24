export function runInSpatialWeb() {
  if (navigator.userAgent.indexOf("WebSpatial/") > 0) {
    return true;
  }
  return false;
}

export function addWebSpatialClassFlagOnHtml() {
  if (runInSpatialWeb()) {
    document.documentElement.classList.add("webspatial");
  }
}
