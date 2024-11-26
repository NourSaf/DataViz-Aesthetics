import * as d3 from "d3";

const firstChartInfor = [
    {
        title: "Ethnicity and Gender Bar Chart" ,
        desciption:"",
    },
];

const secondChartInfo = [
    {
        title: "Year and types of the values" ,
        desciption:"",
    },
];

const divHeight = "100vh";
const divWidth = "100vw";






const createTitle = (chartInfo, chartSelector) => {
    const chart = document.querySelector(chartSelector);
    const titleDiv = document.createElement('div');
    titleDiv.className = "chart-title";
    const title = chartInfo.map(d => d.title);
    titleDiv.innerHTML = title;
    chart.append(titleDiv);
};

createTitle(firstChartInfor, '#ChartOne');
createTitle(secondChartInfo, '#chartTwo');

