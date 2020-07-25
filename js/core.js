const getCurrentDocument = () => {
  return window.document;
};

const removeDuplicationColor = colors => {
  return [...new Set(colors)];
};

const getAllStyles = bodyElement => {
  const styleArr = findStyle(bodyElement);
  console.log(styleArr);
  return removeDuplicationColor(styleArr);
};

const findColor = style => {
  const colors = [];

  colors.push(style.color);
  colors.push(style.backgroundColor);
  colors.push(style.borderTopColor);
  colors.push(style.borderBottomColor);
  colors.push(style.borderLeftColor);
  colors.push(style.borderRightColor);

  return removeDuplicationColor(colors);
};

const findStyle = (element, styleArr = []) => {
  const style = window.getComputedStyle(element);
  const colors = findColor(style);

  styleArr = removeDuplicationColor(styleArr.concat(colors));

  console.log(styleArr);
  if (element.children) {
    for (var childElement of element.children) {
      styleArr = findStyle(childElement, styleArr);
    }
  }
  return styleArr;
};
