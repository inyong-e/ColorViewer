const isGrayScale = (r, g, b) => {
  const ave = (r + g + b) / 3;
  const diff = Math.max(r, g, b) - Math.min(r, g, b);
  return (
    (ave < 100 && diff <= 20) ||
    (ave < 150 && diff <= 15) ||
    (ave < 200 && diff <= 10) ||
    (ave < 225 && diff < 7) ||
    (225 <= ave && diff < 5)
  );
};

const analyzeDrawingColorData = percentageColors => {
  percentageColors = percentageColors.slice(0, 20);
  let isAlreadyGrayScale = false;
  let checkGrayScale = false;

  percentageColors = percentageColors.filter(percentageColor => {
    if (percentageColors.length === 20) {
      checkGrayScale = isGrayScale(...percentageColor.name.split(","));
      if (!checkGrayScale && !isAlreadyGrayScale) {
        isAlreadyGrayScale = true;
      }
    }

    const isSmallGrayScale = checkGrayScale && isAlreadyGrayScale;
    return (
      !isSmallGrayScale &&
      (percentageColors.length < 10 ? true : percentageColor.y >= 100)
    );
  });
  return percentageColors;
};

const componentToHex = c => {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

const rgbToHex = (r, g, b) => {
  return (
    "#" +
    componentToHex(r) +
    componentToHex(g) +
    componentToHex(b)
  ).toUpperCase();
};

const setChartData = colorInfos => {
  let totalAmount = colorInfos.reduce(
    (acc, colorInfo) => acc + colorInfo.amount,
    0,
  );

  const calculatePercentage = colorInfo =>
    Math.round((colorInfo.amount / totalAmount) * 10000) / 100;

  const chartData = colorInfos.map(colorInfo => {
    const { r, g, b } = colorInfo;

    let visible = true;
    const percentage = calculatePercentage(colorInfo);
    if (percentage >= 60) {
      totalAmount -= colorInfo.amount;
      visible = false;
    } else if (percentage < 1) {
      visible = false;
    }

    return {
      visible,
      hex: rgbToHex(r, g, b),
      color: `rgb(${r},${g},${b})`,
      name: `${r},${g},${b}`,
      y: colorInfo.amount,
    };
  });
  return chartData;
};

const drawCharts = data => {
  Highcharts.chart("container", {
    chart: {
      backgroundColor: "transparent",
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    credits: {
      enabled: false,
    },
    exporting: { enabled: false },
    title: {
      text: "Color Analysis",
    },
    tooltip: {
      headerFormat: "",
      pointFormat: `<b>{point.percentage:.1f}%</b><br/>hex: {point.options.hex}<br/>rgb: {point.options.name}`,
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
      },
    },
    legend: {
      backgroundColor: "rgb(248,248,248)",
      borderRadius: 5,
      enabled: true,
      itemMarginTop: 6,
      itemMarginBottom: 6,
      itemStyle: {
        fontSize: "10px",
        color: "rgb(30,30,30)",
      },
      labelFormatter: function () {
        return this.hex;
      },
    },
    series: [
      {
        name: "Percent",
        colorByPoint: true,
        data,
      },
    ],
  });
};

const showColorChart = colorInfos => {
  const percentageColors = setChartData(colorInfos);
  const data = analyzeDrawingColorData(percentageColors);

  hideLoadingBar();
  setStatusText("");
  drawCharts(data);
};
