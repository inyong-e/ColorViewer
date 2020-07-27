const exportColor = async () => {
  var start = new Date().getTime();
  // const document = getCurrentDocument();
  // const styleArr = getAllStyles(document.body);

  const styleArr = await makeCanvas();

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
