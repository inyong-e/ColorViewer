const exportColor = async () => {
  const styleArrInDOM = getAllStyles(document.body);
  const canvasData = await makeCanvas();

  const colorInfos = getRGBColors(canvasData.rgbDataArr, styleArrInDOM);
  if (colorInfos.length === 0) return null;

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
