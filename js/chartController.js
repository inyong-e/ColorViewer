const setChartData = colorInfos => {
  const totalAmount = colorInfos.reduce(
    (acc, colorInfo) => acc + colorInfo.amount,
    0,
  );

  const calculatePercentage = colorInfo =>
    Math.round((colorInfo.amount / totalAmount) * 10000) / 100;

  const chartData = colorInfos.map(colorInfo => {
    const { r, g, b } = colorInfo;
    const y = calculatePercentage(colorInfo);

    return {
      color: `rgb(${r},${g},${b})`,
      name: `rgb(${r},${g},${b})`,
      y,
    };
  });
  return chartData;
};
const showColorChart = colorInfos => {
  const data = setChartData(colorInfos);
  console.log(data);

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
      text: "The Analized Color Graph",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
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
    series: [
      {
        name: "Persent",
        colorByPoint: true,
        data,
      },
    ],
  });
};
