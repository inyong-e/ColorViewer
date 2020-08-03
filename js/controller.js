const hideLoadingBar = () => {
  const loadingBar = document.getElementsByClassName("loading-bar")[0];
  loadingBar.style.display = "none";
  setStatusText("");
};

const setStatusText = text => {
  const statusText = document.getElementById("status-text");
  statusText.style.margin = "auto";
  statusText.innerText = text;
};

const isValidUrl = url => {
  return (
    url.indexOf("https://chrome.google.com") !== 0 &&
    url.indexOf("chrome://") !== 0
  );
};
const excuteToAnalyze = () => {
  chrome.tabs.getSelected(null, function (tab) {
    const isValidURL = isValidUrl(tab.url);
    if (isValidURL) {
      chrome.tabs.sendMessage(tab.id, "exportColor", function (response) {
        if (response) {
          const { imageData, colorInfos } = response;
          hideLoadingBar();
          setStatusText("");
          showColorChart(colorInfos);
        } else {
          hideLoadingBar();
          setStatusText("Doesn't work properly on that web page.");
        }
      });
    } else {
      alert("ColorViewer doesn't work on Google Chrome webstore!");
    }
  });
};

excuteToAnalyze();
