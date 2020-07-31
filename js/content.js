const exportColor = async () => {
  const styleArr = getAllStyles(document.body);
  const canvasData = await makeCanvas();
  const colorInfos = getRGBColors(canvasData.rgbData, styleArr);
  return {
    imageData: canvasData.imageData,
    colorInfos,
  };
};

chrome.runtime.onMessage.addListener(function (
  clickEvent,
  sender,
  sendResponse,
) {
  switch (clickEvent) {
    case "exportColor": {
      exportColor().then(sendResponse);
      break;
    }
  }
  return true;
});
