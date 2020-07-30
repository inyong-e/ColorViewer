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

const parseColorObj = styleArr => {
  const actuallyUsedColors = [];

  for (const colorStyle of styleArr) {
    const subStringIndex = colorStyle.indexOf("(") + 1;
    const colorData = colorStyle.substring(
      subStringIndex,
      colorStyle.length - 1,
    );
    const splitedColor = colorData.split(",");
    const rgbData = {
      r: Number(splitedColor[0]),
      g: Number(splitedColor[1]),
      b: Number(splitedColor[2]),
    };
    actuallyUsedColors.push(rgbData);
  }
  return actuallyUsedColors;
};

const findActuallyUsedColor = (colors, styleArr) => {
  const actuallyColors = parseColorObj(styleArr);
  colors = colors.filter(color =>
    actuallyColors.find(
      actuallyColor =>
        actuallyColor.r === color.r &&
        actuallyColor.g === color.g &&
        actuallyColor.b === color.b,
    ),
  );
  console.log(colors);
};

const getRGBColors = (rgbData, styleArr) => {
  const colors = getGroupingRgbData(rgbData);
  //// 여기에 설정한 색상과 매치하는 함수가 필요함.
  findActuallyUsedColor(colors, styleArr);
  const topColors = getTopColors(colors);
  const sortingColors = getSortingColors(topColors);
  console.log(sortingColors);
};

const getGroupingRgbData = rgbData => {
  const PIXEL_MEASUREMENT = 80; // 4 단위로 끊어야 함.

  const colors = [];
  for (let i = 0; i < rgbData.length; i += PIXEL_MEASUREMENT) {
    let isExistColor = false;
    const r = rgbData[i];
    const g = rgbData[i + 1];
    const b = rgbData[i + 2];
    if (r > 250 && g > 250 && b > 250) continue;
    for (const color of colors) {
      if (color.r === r && color.g === g && color.b === b) {
        color.count++;
        isExistColor = true;
        break;
      }
    }
    if (!isExistColor) {
      colors.push({
        r,
        g,
        b,
        count: 1,
      });
    }
  }
  return colors;
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
