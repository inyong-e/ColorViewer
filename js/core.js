const getCurrentDocument = () => {
  return window.document;
};

const removeDuplicationColor = colors => {
  return [...new Set(colors)];
};

const getAllStyles = bodyElement => {
  const styleArr = findStyle(bodyElement);
  const a = removeDuplicationColor(styleArr);
  return a;
};

const findColor = (style, styleArr) => {
  styleArr.push(style.color);
  styleArr.push(style.backgroundColor);
  styleArr.push(style.borderTopColor);
  styleArr.push(style.borderBottomColor);
  styleArr.push(style.borderLeftColor);
  styleArr.push(style.borderRightColor);
};

const findStyle = (element, styleArr = []) => {
  const style = window.getComputedStyle(element);

  findColor(style, styleArr);
  if (element.children) {
    for (var childElement of element.children) {
      findStyle(childElement, styleArr);
    }
  }
  return styleArr;
};
