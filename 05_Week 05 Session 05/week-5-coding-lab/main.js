import "./style.css";
import * as d3 from "d3";

const RESOURCE_URL = 'https://data.cityofnewyork.us/resource/tg4x-b46p.json?%24query=SELECT%20*%20WHERE%20LOWER(parkingheld)%20LIKE%20\'%2513%20street%25\'';

console.log('hello')


const data = await d3.json(RESOURCE_URL);

console.log(data);

const groupedData = d3.rollup(
  [...data, {}],
  (v) => v.length,
  (d) => {
    const days = [
      'Sunday', // 0,
      'Monday', // 1
      'Tuesday', // 2
      'Wednesday', // 3
      'Thursday',
      'Friday',
      'Saturday',
      undefined // 7
    ]

    const date = new Date(d.startdatetime);
    const index = date.getDay();

    return days[index];
  }
);

console.log(groupedData)

const app = d3.select('#app');

app
.append('div')
.html(`There are ${groupedData.get('Wednesday')} permits on Wednesdays`)

app
.append('div')
.html(`There are ${groupedData.get('Tuesday')} permits on Tuesdays`)