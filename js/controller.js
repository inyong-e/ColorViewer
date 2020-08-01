const hideLoadingBar = () => {
  const loadingBar = document.getElementsByClassName("loading-bar")[0];
  const loadingText = document.getElementById("loading-text");
  loadingBar.style.display = "none";
  loadingText.style.display = "none";
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
        const { imageData, colorInfos } = response;
        showColorChart(colorInfos);
        hideLoadingBar();
      });
    } else {
      alert("ColorViewer doesn't work on Google Chrome webstore!");
    }
  });
};

excuteToAnalyze();
