const COLOR_PROPERTIES = [
  "color",
  "backgroundColor",
  "borderTopColor",
  "borderBottomColor",
  "borderLeftColor",
  "borderRightColor",
];

const getCurrentDocument = () => {
  return window.document;
};

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
    const propertyValue = style.getPropertyValue(property);
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
