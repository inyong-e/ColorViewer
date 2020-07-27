const exportColor = async () => {
  // const document = getCurrentDocument();
  // const styleArr = getAllStyles(document.body);
  const styleArr = await makeCanvas();
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
