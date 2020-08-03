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

const saveChromeStorage = (url, colorInfos) => {
  chrome.storage.sync.set({ url, colorInfos });
};

const isValidUrl = url => {
  return (
    url.indexOf("https://chrome.google.com") !== 0 &&
    url.indexOf("chrome://") !== 0
  );
};

const excuteToAnalyze = () => {
  chrome.tabs.getSelected(null, tab => {
    const isValidURL = isValidUrl(tab.url);

    if (!isValidURL) {
      alert("ColorViewer doesn't work on Google Chrome webstore!");
      return;
    }

    chrome.tabs.sendMessage(tab.id, "exportColor", response => {
      if (response) {
        const { imageData, colorInfos } = response;
        showColorChart(colorInfos);
      } else {
        hideLoadingBar();
        setStatusText("Doesn't work properly on that web page.");
      }
    });
  });
};

chrome.tabs.getSelected(null, tab => {
  chrome.storage.sync.get(data => {
    const isValidStorageData =
      data && data.url && data.colorInfos && data.colorInfos.length;

    if (tab.url === data.url && isValidStorageData) {
      showColorChart(data.colorInfos);
    } else {
      excuteToAnalyze();
    }
  });
});
