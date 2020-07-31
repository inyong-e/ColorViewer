const COLOR_PROPERTIES = [
  "color",
  "backgroundColor",
  "borderTopColor",
  "borderBottomColor",
  "borderLeftColor",
  "borderRightColor",
];

const PIXEL_MEASUREMENT = 80; // 4 단위로 끊어야 함.

const removeDuplicationColor = colors => {
  return [...new Set(colors)];
};

const getAllStyles = bodyElement => {
  const styleArr = findStyle(bodyElement);
  return removeDuplicationColor(styleArr);
};

const findColor = style => {
  const colors = [];

  for (const property of COLOR_PROPERTIES) {
    const propertyValue = style[property];
    if (propertyValue) {
      colors.push(propertyValue);
    }
  }

  return removeDuplicationColor(colors);
};

const findStyle = (element, styleArr = []) => {
  const style = window.getComputedStyle(element);
  const colors = findColor(style);

  styleArr = removeDuplicationColor(styleArr.concat(colors));

  if (element.children) {
    for (var childElement of element.children) {
      styleArr = findStyle(childElement, styleArr);
    }
  }
  return styleArr;
};

// canvas core

const ignoreElements = element => {
  return element.tagName.toLowerCase() === "img";
};

const checkBackgroundImage = element => {
  const isBackgroundImg =
    window.getComputedStyle(element).backgroundImage !== "none";

  if (isBackgroundImg) {
    element.style.backgroundImage = "initial";
  }
};

const findElement = element => {
  /* add set option about DOM */
  checkBackgroundImage(element);

  for (const childElement of element.children) {
    findElement(childElement);
  }
};

const onclone = cloneDocument => {
  findElement(cloneDocument.body);
};

const makeCanvas = async () => {
  const canvas = await html2canvas(document.body, {
    backgroundColor: "white",
    allowTaint: true,
    useCORS: true,
    scrollX: 0,
    scrollY: 0,
    ignoreElements,
    onclone,
  });
  document.body.appendChild(canvas); // <= 이따가 이거 지울 것..!!!!!

  const imageData = canvas
    .getContext("2d")
    .getImageData(0, 0, canvas.width, canvas.height);
  const canvasData = {
    rgbData: imageData.data,
    imageData: canvas.toDataURL(),
  };
  return canvasData;
};

// analytics pixel

const parseColorKey = colorStyleArr => {
  const subStringIndex = colorStyleArr.indexOf("(") + 1;
  const colorData = colorStyleArr.substring(
    subStringIndex,
    colorStyleArr.length - 1,
  );

  return colorData.replace(/ /gi, "");
};

const findActuallyUsedColor = (colors, colorStyleArr) => {
  const result = [];

  for (const colorStyle of colorStyleArr) {
    const parsingColorKey = parseColorKey(colorStyle);
    const colorInfo = colors.get(parsingColorKey);
    if (colorInfo) {
      result.push(colorInfo);
    }
  }

  return result;
};

const getRGBColors = (rgbData, styleArr) => {
  const colors = getGroupingRgbData(rgbData);

  const colorInfos = findActuallyUsedColor(colors, styleArr);
  const sortingColors = getSortingColors(colorInfos);
  return sortingColors;
};

const getGroupingRgbData = rgbData => {
  const colorInfos = new Map();
  for (let i = 0; i < rgbData.length; i += PIXEL_MEASUREMENT) {
    const r = rgbData[i];
    const g = rgbData[i + 1];
    const b = rgbData[i + 2];

    if (r > 250 && g > 250 && b > 250) continue;
    const key = `${r},${g},${b}`;
    const colorInfo = colorInfos.get(key);
    if (colorInfo) {
      colorInfo.amount = colorInfo.amount + 1;
      colorInfos.set(key, colorInfo);
    } else {
      colorInfos.set(key, { r, g, b, amount: 1 });
    }
  }

  return colorInfos;
};

const getSortingColors = colorInfos => {
  colorInfos = colorInfos.sort((color1, color2) => {
    return color2.amount - color1.amount;
  });
  return colorInfos;
};
