const channel = new BroadcastChannel("my_channel");
var closeChannelMessageCb: () => void;

channel.onmessage = (e) => {
  if (e.data.type === "closeApp") {
    if (closeChannelMessageCb) closeChannelMessageCb();
  }
};

export function sendCloseAppMessage() {
  const message = {
    type: "closeApp",
    payload: {},
  };
  channel.postMessage(message);
}

export function onCloseAppMessage(callback: () => void) {
  closeChannelMessageCb = callback;
}
