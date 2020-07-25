chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  const a = window.getComputedStyle(document.body).backgroundColor;

  sendResponse({
    data: a,
  });
});
