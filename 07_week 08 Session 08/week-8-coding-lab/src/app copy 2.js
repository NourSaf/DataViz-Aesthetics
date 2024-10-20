import * as d3 from "d3";
import { RiTa as ri } from "rita";
import Sentiment from "sentiment";

import { partsOfSpeech } from "./partsOfSpeech.js";

const sentiment = new Sentiment();

const fetchData = async () => {
  const text = await d3.text("sotu/Wilson_1913.txt");
  const tokens = ri.tokenize(text);
  
  const trump = d3.rollup(tokens,
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
  return  trump
  
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

// Create the word bar chart
const margin = { top: 20, right: 30, bottom: 40, left: 90 };
const width = 800 - margin.left - margin.right;
const height = 200 - margin.top - margin.bottom; // Adjusted height for each chart

// Function to create a bar chart
const createBarChart = (categories, chartId) => {
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
    .range(d3.schemePastel1); // Using D3's category10 color scheme

  svg.append("g")
    .call(d3.axisLeft(y));

  svg.selectAll("rect")
    .data(categories)
    .enter()
    .append("rect")
    .attr("x", x(0))
    .attr("y", d => y(d.name))
    .attr("width", d => x(d.count))
    .attr("height", y.bandwidth())
    .attr("fill", d => color(d.name));

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));
};

// Create a graph that shows all the negative and positive words and their count
const wordCategories = [
  ...positiveWords.map(word => ({ name: word, count: data.get(word).occurrences })),
  ...negativeWords.map(word => ({ name: word, count: data.get(word).occurrences }))
];


// Create the sentiment bar chart
createBarChart(sentimentCategories, "sentiment-chart");

// Create the topic bar chart
createBarChart(topicCategories, "topic-chart");
