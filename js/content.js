const exportColor = async () => {
  const styleArrInDOM = getAllStyles(document.body);
  const canvasData = await makeCanvas();
  const colorInfos = getRGBColors(canvasData.rgbData, styleArrInDOM);
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
