import { SpatialHelper } from "@webspatial/core-sdk";

export function runInSpatialWeb() {
  if (SpatialHelper.instance) {
    return true;
  }
  return false;
}

export function addWebSpatialClassFlagOnHtml() {
  if (runInSpatialWeb()) {
    document.documentElement.classList.add("webspatial");
  }
}
