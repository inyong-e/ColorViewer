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

// canvas

const ignoreElements = element => {
  return element.tagName.toLowerCase() === "img";
};

const checkBackgroundImage = element => {
  const isBackgroundImg =
    window.getComputedStyle(element).backgroundImage !== "none";
  if (isBackgroundImg) {
    element.style.backgroundImage = "url()";
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
    scrollX: 0,
    scrollY: 0,
    ignoreElements,
    onclone,
  });
  var ctx = canvas.getContext("2d");
  document.body.appendChild(canvas);

  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imageData.data;
  console.log(data);
  return 1;
};
