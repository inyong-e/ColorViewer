const getBodyDOM = async () => {
  const bodyHTML = await getBodyHTML();
  const bodyDOM = document.createElement("div");
  bodyDOM.innerHTML = bodyHTML;
  return bodyDOM;
};

const getBodyHTML = () => {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.executeScript(
        {
          code: 'document.querySelector("body").innerHTML',
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

const getAllStyles = bodyElement => {
  return findStyle(bodyElement);
};

const findStyle = (element, styleArr = []) => {
  if (element.children) {
    for (var childElement of element.children) {
      findStyle(childElement, styleArr);
    }
  }
  return styleArr;
};
