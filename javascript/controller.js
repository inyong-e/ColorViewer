const getBodyDOM = () => {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.executeScript(
        {
          code: 'document.querySelector("body")',
        },
        function (result) {
          resolve(result[0]);
        },
      );
    } catch (error) {
      reject(error);
    }
  });
};

const onClickExport = async () => {
  const a = await getBodyDOM();
  alert(a);
};

const exportBtn = document.getElementById("export-btn");
exportBtn.addEventListener("click", onClickExport);
