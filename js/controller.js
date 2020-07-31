const isValidUrl = url => {
  return (
    url.indexOf("https://chrome.google.com") !== 0 &&
    url.indexOf("chrome://") !== 0
  );
};
const onClickExport = () => {
  chrome.tabs.getSelected(null, function (tab) {
    const isValidURL = isValidUrl(tab.url);
    if (isValidURL) {
      chrome.tabs.sendMessage(tab.id, "exportColor", function (response) {
        const { imageData, colorInfos } = response;
        showColorChart(colorInfos);
      });
    } else {
      alert("ColorViewer doesn't work on Google Chrome webstore!");
    }
  });
};

const exportBtn = document.getElementById("export-btn");
exportBtn.addEventListener("click", onClickExport);
