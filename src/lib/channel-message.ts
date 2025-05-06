const channel = new BroadcastChannel("my_channel");
channel.onmessage = (e) => {
  console.log("Received:", e.data);
  if (e.data.type === "closeApp") {
    // @todo: close current scene
  }
};

export function sendCloseAppMessage() {
  const content = {
    type: "closeApp",
    payload: {},
  };
  channel.postMessage({ content });
}
