const exportColor = async () => {
  const attributeColorsInDOM = getAppliedAttributeColors(document.body);
  const canvasData = await makeCanvas();

  const colorInfos = getRGBColors(canvasData.rgbDataArr, attributeColorsInDOM);
  if (colorInfos.length === 0) return null;

  return {
    // imageData: canvasData.imageData,
    colorInfos,
  };
};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  const { clickEvent } = message;
  switch (clickEvent) {
    case "exportColor": {
      exportColor().then(sendResponse);
      break;
    }
    case "highlightSelectedColor": {
      const { rgb, hex, isSelect } = message;
      executeHighlighting(rgb, hex, isSelect);
      sendResponse(true);
      break;
    }
  }
  return true;
});
