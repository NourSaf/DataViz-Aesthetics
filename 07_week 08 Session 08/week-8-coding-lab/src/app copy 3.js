import * as d3 from "d3";
import { RiTa as ri } from "rita";
import Sentiment from "sentiment";

import { partsOfSpeech } from "./partsOfSpeech.js";

//chronological order of US president 
const presidents = [
  { name: 'George Washington', year: 1789 },
  { name: 'John Adams', year: 1797 },
  { name: 'Thomas Jefferson', year: 1801 },
  { name: 'James Madison', year: 1809 },
  { name: 'James Monroe', year: 1817 },
  { name: 'John Quincy Adams', year: 1825 },
  { name: 'Andrew Jackson', year: 1829 },
  { name: 'Martin Van Buren', year: 1837 },
  // { name: 'William Henry Harrison', year: 1841 },
  { name: 'John Tyler', year: 1841 },
  { name: 'James K. Polk', year: 1845 },
  { name: 'Zachary Taylor', year: 1849 },
  { name: 'Millard Fillmore', year: 1850 },
  { name: 'Franklin Pierce', year: 1853 },
  { name: 'James Buchanan', year: 1857 },
  { name: 'Abraham Lincoln', year: 1861 },
  { name: 'Andrew Johnson', year: 1865 },
  { name: 'Ulysses S. Grant', year: 1869 },
  { name: 'Rutherford B. Hayes', year: 1877 },
  // { name: 'James A. Garfield', year: 1881 },
  { name: 'Chester A. Arthur', year: 1881 },
  { name: 'Grover Cleveland', year: 1885 },
  { name: 'Benjamin Harrison', year: 1889 },
  { name: 'Grover Cleveland', year: 1893 },
  { name: 'William McKinley', year: 1897 },
  { name: 'Theodore Roosevelt', year: 1901 },
  { name: 'William Howard Taft', year: 1909 },
  { name: 'Woodrow Wilson', year: 1913 },
  { name: 'Warren G. Harding', year: 1921 },
  { name: 'Calvin Coolidge', year: 1923 },
  { name: 'Herbert Hoover', year: 1929 },
  { name: 'Franklin D. Roosevelt', year: 1933 },
  { name: 'Harry S. Truman', year: 1945 },
  { name: 'Dwight D. Eisenhower', year: 1953 },
  { name: 'John F. Kennedy', year: 1961 },
  { name: 'Lyndon B. Johnson', year: 1963 },
  { name: 'Richard Nixon', year: 1969 },
  { name: 'Gerald Ford', year: 1974 },
  { name: 'Jimmy Carter', year: 1977 },
  { name: 'Ronald Reagan', year: 1981 },
  { name: 'George H. W. Bush', year: 1989 },
  { name: 'Bill Clinton', year: 1993 },
  { name: 'George W. Bush', year: 2001 },
  { name: 'Barack Obama', year: 2009 },
  { name: 'Donald analysedText', year: 2017 },
  { name: 'Joe Biden', year: 2021 }
];

// Arrange txt files in order of presidents' tenure
const files = presidents.map(president => {
  const lastName = president.name.split(' ').pop();
  return `Aggregated_Speeches/${lastName}.txt`;
});

const sentiment = new Sentiment();

const fetchData = async () => {
  const text = await d3.text("sotu/Wilson_1913.txt");
  const tokens = ri.tokenize(text);
  
  const analysedText = d3.rollup(tokens,
    (v, ...args) => {
      console.log("those are all the words",v)
      const word = v[0]
      console.log('this is my word',word)
      const score = sentiment.analyze(v.join(" ")).score
      console.log("this is my score",score)
      const posType = ri.pos(word, { simple: false })[0];
      const posdetails = partsOfSpeech[posType]
      console.log("this is my posDetials",posdetails)
      
      return {
        occurrences: v.length,
        sentiment: score,
        partOfSpeech: posdetails,
      };
    },
    (d) => {
       const lowercase=d.toLowerCase()
       console.log("this is lowerCase",lowercase)
       return lowercase
    }
  );
  return  analysedText
  
};

const data = await fetchData();
const positiveWords = [];
const negativeWords = [];
const neutralWords = [];
const politicsWords = [];
const economyWords = [];
const countriesWords = [];
const socialSecurityWords = [];

const politicsKeywords = ["government", "election", "policy", "president", "congress"];
const economyKeywords = ["economy", "market", "trade", "finance", "budget", "investment", "inflation", "recession", "growth", "debt", "tax", "revenue", "expenditure", "subsidy", "tariff", "import", "export", "bank", "currency", "stock", "bond", "interest", "loan", "credit", "capital"];
const countriesKeywords = [
  "afghanistan", "albania", "algeria", "andorra", "angola", "antigua and barbuda", "argentina", "armenia", "australia", "austria",
  "azerbaijan", "bahamas", "bahrain", "bangladesh", "barbados", "belarus", "belgium", "belize", "benin", "bhutan", "bolivia",
  "bosnia and herzegovina", "botswana", "brazil", "brunei", "bulgaria", "burkina faso", "burundi", "cabo verde", "cambodia", "cameroon",
  "canada", "central african republic", "chad", "chile", "china", "colombia", "comoros", "congo", "costa rica", "croatia", "cuba",
  "cyprus", "czech republic", "denmark", "djibouti", "dominica", "dominican republic", "ecuador", "egypt", "el salvador", "equatorial guinea",
  "eritrea", "estonia", "eswatini", "ethiopia", "fiji", "finland", "france", "gabon", "gambia", "georgia", "germany", "ghana", "greece",
  "grenada", "guatemala", "guinea", "guinea-bissau", "guyana", "haiti", "honduras", "hungary", "iceland", "india", "indonesia", "iran",
  "iraq", "ireland", "israel", "italy", "jamaica", "japan", "jordan", "kazakhstan", "kenya", "kiribati", "north korea", "south korea",
  "kosovo", "kuwait", "kyrgyzstan", "laos", "latvia", "lebanon", "lesotho", "liberia", "libya", "liechtenstein", "lithuania", "luxembourg",
  "madagascar", "malawi", "malaysia", "maldives", "mali", "malta", "marshall islands", "mauritania", "mauritius", "mexico", "micronesia",
  "moldova", "monaco", "mongolia", "montenegro", "morocco", "mozambique", "myanmar", "namibia", "nauru", "nepal", "netherlands", "new zealand",
  "nicaragua", "niger", "nigeria", "north macedonia", "norway", "oman", "pakistan", "palau", "panama", "papua new guinea", "paraguay", "peru",
  "philippines", "poland", "portugal", "qatar", "romania", "russia", "rwanda", "saint kitts and nevis", "saint lucia", "saint vincent and the grenadines",
  "samoa", "san marino", "sao tome and principe", "saudi arabia", "senegal", "serbia", "seychelles", "sierra leone", "singapore", "slovakia",
  "slovenia", "solomon islands", "somalia", "south africa", "south sudan", "spain", "sri lanka", "sudan", "suriname", "sweden", "switzerland",
  "syria", "taiwan", "tajikistan", "tanzania", "thailand", "timor-leste", "togo", "tonga", "trinidad and tobago", "tunisia", "turkey",
  "turkmenistan", "tuvalu", "uganda", "ukraine", "united arab emirates", "united kingdom", "united states", "uruguay", "uzbekistan", "vanuatu",
  "vatican city", "venezuela", "vietnam", "yemen", "zambia", "zimbabwe"
];
const socialSecurityKeywords = ["social security", "welfare", "pension", "retirement", "disability", "medicare", "medicaid", "unemployment", "benefits", "assistance", "aid", "support", "insurance", "coverage", "entitlement", "allowance", "grant", "subsidy", "compensation", "relief"];

data.forEach((value, key) => {
  if (value.sentiment > 0) {
    positiveWords.push(key);
  } else if (value.sentiment < 0) {
    negativeWords.push(key);
  }

  if (politicsKeywords.includes(key)) {
    politicsWords.push(key);
  }
  if (economyKeywords.includes(key)) {
    economyWords.push(key);
  }
  if (countriesKeywords.includes(key)) {
    countriesWords.push(key);
  }
  if (socialSecurityKeywords.includes(key)) {
    socialSecurityWords.push(key);
  }
});

console.log("Positive words:", positiveWords);
console.log("Negative words:", negativeWords);
console.log("Neutral words:", neutralWords);
console.log("Politics words:", politicsWords);
console.log("Economy words:", economyWords);
console.log("Countries words:", countriesWords);
console.log("Social Security words:", socialSecurityWords);

// console.log("This is my data",data)


const app = d3.select('#app');
// Split the categories into two groups
const sentimentCategories = [
  { name: "Positive", count: positiveWords.length },
  { name: "Negative", count: negativeWords.length },
];

const topicCategories = [
  { name: "Politics", count: politicsWords.length },
  { name: "Economy", count: economyWords.length },
  { name: "Countries", count: countriesWords.length },
  { name: "Social Security", count: socialSecurityWords.length },
];

const displayFullText = (text) => {
  app.append("div")
    .attr("id", "full-text")
    .style("white-space", "pre-wrap")
    .style("margin", "20px")
    .style("padding", "10px")
    .style("border", "1px solid #ccc")
    .style("background-color", "#f9f9f9")
    .style("height", "400px")
    .style("overflow-y", "scroll")
    .text(text);
};

// Fetch the full text and display it
d3.text("sotu/Wilson_1913.txt").then(displayFullText);

// Create the word bar chart
const margin = { top: 20, right: 30, bottom: 40, left: 90 };
const width = 800 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom; // Adjusted height for each chart

// Function to create a bar chart
const createSentimentBarChart = (categories, chartId) => {
  const svg = app.append("svg")
    .attr("id", chartId)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear()
    .domain([0, d3.max(categories, d => d.count)])
    .range([0, width]);

  const y = d3.scaleBand()
    .domain(categories.map(d => d.name))
    .range([0, height])
    .padding(0.2);

  const color = d3.scaleOrdinal()
    .domain(categories.map(d => d.name))
    .range(["green", "red"]); // Green for positive, red for negative

  const group = svg.append("g").attr("class", "group");

  const rects = group.selectAll(".bar-group")
    .data(categories)
    .enter()
    .append("g")
    .attr("class", "bar-group")
    .style("padding", "10px");

  rects.append("rect")
    .attr("x", x(0))
    .attr("y", d => y(d.name))
    .attr("width", d => x(d.count))
    .attr("height", 20)
    .attr("fill", d => color(d.name))
    .style("margin", "40px");

  rects.append("text")
    .attr("x", 5)
    .attr("y", d => y(d.name) - 10)
    .attr("dy", ".35em")
    .text(d => `${d.name}: ${d.count}`)
    .style("fill", "black");

  svg.append("g").call(d3.axisLeft(y)).style("display", "none");
  svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x)).style("display", "none");
};

const createTopicBarChart = (categories, chartId) => {
  const svg = app.append("svg")
    .attr("id", chartId)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear()
    .domain([0, d3.max(categories, d => d.count)])
    .range([0, width]);

  const y = d3.scaleBand()
    .domain(categories.map(d => d.name))
    .range([0, height])
    .padding(0.2);

  const color = d3.scaleOrdinal()
    .domain(categories.map(d => d.name))
    .range(d3.schemePastel1);

  const group = svg.append("g").attr("class", "group");

  const rects = group.selectAll(".bar-group")
    .data(categories)
    .enter()
    .append("g")
    .attr("class", "bar-group")
    .style("padding", "10px");

  rects.append("rect")
    .attr("x", x(0))
    .attr("y", d => y(d.name))
    .attr("width", d => x(d.count))
    .attr("height", 20)
    .attr("fill", d => color(d.name))
    .style("margin", "40px");

  rects.append("text")
    .attr("x", 5)
    .attr("y", d => y(d.name) - 10)
    .attr("dy", ".35em")
    .text(d => `${d.name}: ${d.count}`)
    .style("fill", "black");

  svg.append("g").call(d3.axisLeft(y)).style("display", "none");
  svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x)).style("display", "none");
};


createSentimentBarChart(sentimentCategories, "sentiment-chart");
createTopicBarChart(topicCategories, "topic-chart");

