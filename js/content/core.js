const HIGHLIGHTING_CLASS_NAME = "ColorViewer-selected-chart-color";

const COLOR_PROPERTIES = [
  "color",
  "backgroundColor",
  "borderTopColor",
  "borderBottomColor",
  "borderLeftColor",
  "borderRightColor",
];

const PIXEL_MEASUREMENT = 80; // 4 단위로 끊어야 함.

const setClassNameForHighlighting = element => {
  element.className = element.className + " " + HIGHLIGHTING_CLASS_NAME;
};

const cancelHighlighting = () => {
  const highlightingElements = document.getElementsByClassName(
    HIGHLIGHTING_CLASS_NAME,
  );

  while (highlightingElements.length) {
    highlightingElements[0].classList.remove(HIGHLIGHTING_CLASS_NAME);
  }
};

const executeHighlighting = (rgb, isSelect) => {
  const bodyColor = parseColorKey(window.getComputedStyle(document.body).color);

  const findSetHighlightingElement = element => {
    const style = window.getComputedStyle(element);
    const isApplicable = COLOR_PROPERTIES.some(
      colorProperty => rgb === parseColorKey(style[colorProperty]),
    );
    if (isApplicable) {
      if (bodyColor === rgb) {
        const childNodes = [...element.childNodes];
        const isExitsInnerText = childNodes.some(node => {
          return (
            node.data &&
            node.data.replace(/(\r\n\t|\n|\r\t)/gm, "").replace(/(\s*)/g, "")
          );
        });
        if (isExitsInnerText) {
          setClassNameForHighlighting(element);
        }
      } else {
        setClassNameForHighlighting(element);
      }
    }
    if (element.children) {
      for (var childElement of element.children) {
        attributeColors = findSetHighlightingElement(childElement);
      }
    }
  };

  if (isSelect) {
    cancelHighlighting();
    findSetHighlightingElement(document.body);
  } else {
    cancelHighlighting();
  }
};

const removeDuplicationColor = colors => {
  return [...new Set(colors)];
};

const getAppliedAttributeColors = bodyElement => {
  const attributeColors = findStyle(bodyElement);
  return removeDuplicationColor(attributeColors);
};

const findColor = style => {
  const colors = COLOR_PROPERTIES.reduce((accArr, property) => {
    const propertyValue = style[property];
    return propertyValue ? [...accArr, propertyValue] : accArr;
  }, []);

  return removeDuplicationColor(colors);
};

const findStyle = (element, attributeColors = []) => {
  const style = window.getComputedStyle(element);
  const colors = findColor(style);

  attributeColors = removeDuplicationColor(attributeColors.concat(colors));

  if (element.children) {
    for (var childElement of element.children) {
      attributeColors = findStyle(childElement, attributeColors);
    }
  }
  return attributeColors;
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

  const imageData = canvas
    .getContext("2d")
    .getImageData(0, 0, canvas.width, canvas.height);
  const canvasData = {
    rgbDataArr: imageData.data,
    // imageData: canvas.toDataURL(),
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
  return colorStyleArr.reduce((accArr, colorStyle) => {
    const parsingColorKey = parseColorKey(colorStyle);
    const colorInfo = colors.get(parsingColorKey);
    return colorInfo ? [...accArr, colorInfo] : accArr;
  }, []);
};

const getRGBColors = (rgbDataArr, attributeColors) => {
  const colors = getGroupingRgbData(rgbDataArr);

  const colorInfos = findActuallyUsedColor(colors, attributeColors);
  const sortingColors = getSortingColors(colorInfos);
  return sortingColors;
};

const getGroupingRgbData = rgbDataArr => {
  const colorInfos = new Map();

  const addAmount = (r, g, b, accAmount) => {
    const key = `${r},${g},${b}`;
    const colorInfo = colorInfos.get(key);

    if (colorInfo) {
      colorInfo.amount = colorInfo.amount + accAmount;
    } else {
      colorInfos.set(key, { r, g, b, amount: accAmount });
    }
  };

  let accR = (accG = accB = "");
  let accAmount = 0;

  for (let i = 0; i < rgbDataArr.length; i += PIXEL_MEASUREMENT) {
    const r = rgbDataArr[i];
    const g = rgbDataArr[i + 1];
    const b = rgbDataArr[i + 2];

    if (r >= 250 && g >= 250 && b >= 250) continue;
    if (r <= 10 && g <= 10 && b <= 10) continue;

    if (accR === r && accG === g && accB === b) {
      accAmount++;
      continue;
    } else if (accAmount !== 0) {
      addAmount(accR, accG, accB, accAmount);
    }
    accR = r;
    accG = g;
    accB = b;

    accAmount = 1;
  }
  addAmount(accR, accG, accB, accAmount);

  return colorInfos;
};

const getSortingColors = colorInfos => {
  colorInfos = colorInfos.sort((color1, color2) => {
    return color2.amount - color1.amount;
  });
  return colorInfos;
};
