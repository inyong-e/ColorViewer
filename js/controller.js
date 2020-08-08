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

const onClickColorInChart = (rgb, hex, isSelect) => {
  var start = new Date().getTime();

  runChromeTabsGetSelected(tab => {
    chrome.tabs.sendMessage(
      tab.id,
      { clickEvent: "highlightSelectedColor", rgb, hex, isSelect },
      response => {
        if (response) {
          var elapsed = new Date().getTime() - start;
          console.log(elapsed);
        } else {
          hideLoadingBar();
          setStatusText("Doesn't work properly on that web page.");
        }
      },
    );
  });
};

const executeToAnalyze = tab => {
  const isValidURL = isValidUrl(tab.url);

  if (!isValidURL) {
    alert("ColorViewer doesn't work on Google Chrome webStore!");
    return;
  }

  chrome.tabs.sendMessage(tab.id, { clickEvent: "exportColor" }, response => {
    if (response) {
      const { colorInfos } = response;
      showColorChart(colorInfos);
      saveChromeStorage(tab.url, colorInfos);
    } else {
      hideLoadingBar();
      setStatusText("Doesn't work properly on that web page.");
    }
  });
};

const runChromeTabsGetSelected = cb => {
  chrome.tabs.getSelected(null, tab => {
    cb(tab);
  });
};

const executeColorViewer = tab => {
  chrome.storage.sync.get(data => {
    const isValidStorageData =
      data && data.url && data.colorInfos && data.colorInfos.length;

    if (tab.url === data.url && isValidStorageData) {
      showColorChart(data.colorInfos);
    } else {
      executeToAnalyze(tab);
    }
  });
};

runChromeTabsGetSelected(tab => {
  executeColorViewer(tab);
});
