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

const checkValidColor = persentageColors => {
  const firstColorData = persentageColors[0];
  if (isGrayScale(...firstColorData.name.split(","))) {
    if (firstColorData.y > 60) {
      persentageColors.shift();
    }
  }

  persentageColors = persentageColors.slice(0, 20);
  let isAlreadyGrayScale = false;
  let checkGrayScale = false;
  persentageColors = persentageColors.filter(persentageColor => {
    if (persentageColors.length >= 20) {
      checkGrayScale = isGrayScale(...persentageColor.name.split(","));
      if (!checkGrayScale && !isAlreadyGrayScale) {
        isAlreadyGrayScale = true;
      }
    }

    return (
      !(checkGrayScale && isAlreadyGrayScale) &&
      (persentageColors.length < 10 ? true : persentageColor.y >= 100)
    );
  });
  return persentageColors;
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
  const chartData = colorInfos.map(colorInfo => {
    const { r, g, b } = colorInfo;

    return {
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
      enabled: true,
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      labelFormatter: function () {
        // return this.name + " - " + this.y + "%";
        return this.y + " %";
      },
    },
    series: [
      {
        name: "Persent",
        colorByPoint: true,
        data,
      },
    ],
  });
};

const showColorChart = colorInfos => {
  const persentageColors = setChartData(colorInfos);
  const data = checkValidColor(persentageColors);

  hideLoadingBar();
  setStatusText("");
  saveChromeStorage(tab.url, colorInfos);
  drawCharts(data);
};
