const exportColor = () => {
  const document = getCurrentDocument();
  const styleArr = getAllStyles(document.body);
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
      responseData = exportColor();
      break;
    }
  }

  sendResponse(responseData);
});
