const COLOR_PROPERTIES = [
  "color",
  "backgroundColor",
  "borderTopColor",
  "borderBottomColor",
  "borderLeftColor",
  "borderRightColor",
];

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
  var ctx = canvas.getContext("2d");
  document.body.appendChild(canvas); // <= 이따가 이거 지울 것..!!!!!

  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imageData.data;
  return data;
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

  findActuallyUsedColor(colors, styleArr);
  // const topColors = getTopColors(colors);
  // const sortingColors = getSortingColors(topColors);
  // console.log(sortingColors);
};

const getGroupingRgbData = rgbData => {
  const PIXEL_MEASUREMENT = 80; // 4 단위로 끊어야 함.

  const colorInfos = new Map();
  for (let i = 0; i < rgbData.length; i += PIXEL_MEASUREMENT) {
    const r = rgbData[i];
    const g = rgbData[i + 1];
    const b = rgbData[i + 2];

    if (r > 250 && g > 250 && b > 250) continue;
    const key = `${r},${g},${b}`;
    const colorInfo = colorInfos.get(key);
    if (colorInfo) {
      colorInfo.count = colorInfo.count + 1;
      colorInfos.set(key, colorInfo);
    } else {
      colorInfos.set(key, { r, g, b, count: 1 });
    }
  }

  return colorInfos;
};

const minOfColorsArray = topColorsArray => {
  let minIndex = 0;
  for (let i = 1; i < topColorsArray.length; i++) {
    if (topColorsArray[minIndex].count > topColorsArray[i].count) {
      minIndex = i;
    }
  }
  return minIndex;
};

const getTopColors = colors => {
  const MAX_SHOWING_COLORS = 10;

  const topColorsArray = [];
  let minIndex = -1;
  for (const color of colors) {
    if (topColorsArray.length < MAX_SHOWING_COLORS) {
      topColorsArray.push(color);
      if (topColorsArray.length === MAX_SHOWING_COLORS) {
        minIndex = minOfColorsArray(topColorsArray);
      }
    } else {
      if (topColorsArray[minIndex].count < color.count) {
        topColorsArray[minIndex] = color;
        minIndex = minOfColorsArray(topColorsArray);
      }
    }
  }
  return topColorsArray;
};

const getSortingColors = topColorsArray => {
  topColorsArray = topColorsArray.sort((color1, color2) => {
    return color2.count - color1.count;
  });
  return topColorsArray;
};

// TEST CODE

const timer = (func, maxCount) => {
  var start = new Date().getTime();
  maxCount = maxCount ? maxCount : 1;
  for (var n = 0; n < maxCount; n++) {
    func();
  }
  var elapsed = new Date().getTime() - start;
  return elapsed;
};
