const exportColor = async () => {
  var start = new Date().getTime();
  const styleArr = getAllStyles(document.body);
  const rgbData = await makeCanvas();

  getRGBColors(rgbData, styleArr);

  var elapsed = new Date().getTime() - start;
  console.log("실행 시간:", elapsed);

  return styleArr;
};

chrome.runtime.onMessage.addListener(function (
  clickEvent,
  sender,
  sendResponse,
) {
  let responseData = null;
  switch (clickEvent) {
    case "exportColor": {
      responseData = exportColor().then(responseData => {
        sendResponse(responseData);
      });
      break;
    }
  }
});
