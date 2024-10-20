import * as d3 from "d3";
import { RiTa as ri } from "rita";
import Sentiment from "sentiment";

import { partsOfSpeech } from "./partsOfSpeech.js";
import names from "/fileList.json";

// const files = names.map(name => `sotu/${name}`);

names.sort((a, b) => {
  const [nameA, yearA] = a.split('_');
  const [nameB, yearB] = b.split('_');
  return parseInt(yearA) - parseInt(yearB);
});

const files = names.map(name => `sotu/${name}`);

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

const fetchAndDisplayText = async (file) => {
  const text = await d3.text(file);
  displayFullText(text);
};

const displayFullText = (text) => {
  app.selectAll("p").remove(); // Clear previous text
  app.append("p").text(text);
};

const createDropdown = () => {
  const dropdown = app.append("select")
    .attr("id", "text-dropdown")
    .style("margin", "20px");

  dropdown.selectAll("option")
    .data(files)
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d.split('/').pop().replace('.txt', ''));

  dropdown.on("change", function() {
    const selectedFile = d3.select(this).property("value");
    fetchAndDisplayText(selectedFile);
  });
};

createDropdown();