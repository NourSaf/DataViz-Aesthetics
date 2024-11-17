import * as d3 from "d3";

const data = await d3.csv('/data/sentimentdataset.csv')
console.log(data)

const filteredData = data.filter(d => [2020, 2021, 2022, 2023].includes(+d.Year));

const data_1 = d3.rollup(filteredData,
    (v) => v.length,
    (d) => d.Year,
    (e) => e.Sentiment,
);
console.log(data_1)
