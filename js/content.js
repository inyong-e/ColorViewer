const exportColor = async () => {
  const attributeColorsInDOM = getAppliedAttributeColors(document.body);
  const canvasData = await makeCanvas();

  const colorInfos = getRGBColors(canvasData.rgbDataArr, attributeColorsInDOM);
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
