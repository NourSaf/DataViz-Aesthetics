import * as d3 from "d3";
import { RiTa as ri } from "rita";
import Sentiment from "sentiment";

import { partsOfSpeech } from "./partsOfSpeech.js";
import names from "/fileList.json";

names.sort((a, b) => {
  const [nameA, yearA] = a.split('_');
  const [nameB, yearB] = b.split('_');
  return parseInt(yearA) - parseInt(yearB);
});

const files = names.map(name => `sotu/${name}`);
console.log("this is my file",files)

const sentiment = new Sentiment();

const fetchData = async () => {
  const dropdown = d3.select("#text-dropdown");
  if (dropdown.empty()) {
    console.error("Dropdown element not found");
    return;
  }
  const selectedFile = dropdown.property("value");

  const text = await d3.text(selectedFile);
  const tokens = ri.tokenize(text);
  
  const analysedText = d3.rollup(tokens,
    (v) => {
      const word = v[0];
      const score = sentiment.analyze(v.join(" ")).score;
      const posType = ri.pos(word, { simple: false })[0];
      const posdetails = partsOfSpeech[posType];
      
      return {
        occurrences: v.length,
        sentiment: score,
        partOfSpeech: posdetails,
      };
    },
    (d) => d.toLowerCase()
  );
  return analysedText;
};

const app = d3.select('#app');

const createDropdown = () => {
  const dropdownContainer = app.append("div")
    .attr("id", "dropdown-container")
    .style("margin", "20px");

  const dropdown = dropdownContainer.append("select")
    .attr("id", "text-dropdown");

  dropdown.selectAll("option")
    .data(files)
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d.split('/').pop().replace('.txt', ''));

  dropdown.on("change", async function() {
    const selectedFile = d3.select(this).property("value");
    await fetchAndDisplayText(selectedFile);
    const data = await fetchData();
    processData(data);
  });
};

const processData = (data) => {
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
};

createDropdown();

app.append("div")
  .attr("id", "text-content")
  .style("white-space", "pre-wrap")
  .style("height", "500px")
  .style("overflow-y", "scroll");

const data = await fetchData();
const fetchAndDisplayText = async (selectedFile) => {
  const text = await d3.text(selectedFile);
  d3.select("#text-content").text(text);
};

app.append("div").attr("id", "text-content").style("white-space", "pre-wrap");

processData(data);

const displayCommonWords = async () => {
  const allTexts = await Promise.all(files.map(file => d3.text(file)));
  const allTokens = allTexts.flatMap(text => ri.tokenize(text.toLowerCase()));

  // List of common stop words to remove
  const stopWords = new Set(["on", "of", "the", "and", "a", "to", "in", "is", "it", "that", "with", "as", "for", "was", "were", "by", "at", "an", "be", "this", "which", "or", "from", "but", "not", "are", "have", "has", "had", "they", "their", "its", "if", "will", "would", "can", "could", "should", "shall", "may", "might", "must", "do", "does", "did", "done", "been", "being", "we", "you", "he", "she", "him", "her", "them", "us", "our", "your", "his", "hers", "theirs", "i", "me", "my", "mine", "yours", "ours", "themselves", "yourself", "ourselves", "yourselves", "himself", "herself", "itself", "who", "whom", "whose", "which", "that", "these", "those", "there", "here", "when", "where", "why", "how", "what", "all", "any", "some", "no", "yes", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]);
  const filteredTokens = allTokens.filter(token => !stopWords.has(token));
  const tokenCounts = d3.rollup(filteredTokens, v => v.length, d => d);

  const sortedTokens = Array.from(tokenCounts.entries()).sort((a, b) => b[1] - a[1]);

  const commonWordsContainer = app.append("div")
    .attr("id", "common-words")
    .style("position", "fixed")
    .style("right", "0")
    .style("top", "0")
    .style("width", "500px")
    .style("height", "100%")
    .style("overflow-y", "auto")
    .style("background-color", "#f9f9f9")
    .style("padding", "20px");

  commonWordsContainer.append("h3").text("List of Words over all the texts");

  const list = commonWordsContainer.append("ul");

  // Display most repeated positive and negative words
  const positiveWords = [];
  const negativeWords = [];
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

  filteredTokens.forEach(token => {
    const score = sentiment.analyze(token).score;
    if (score > 0) {
      positiveWords.push(token);
    } else if (score < 0) {
      negativeWords.push(token);
    }

    if (politicsKeywords.includes(token)) {
      politicsWords.push(token);
    }
    if (economyKeywords.includes(token)) {
      economyWords.push(token);
    }
    if (countriesKeywords.includes(token)) {
      countriesWords.push(token);
    }
    if (socialSecurityKeywords.includes(token)) {
      socialSecurityWords.push(token);
    }
  });

  const positiveCounts = d3.rollup(positiveWords, v => v.length, d => d);
  const negativeCounts = d3.rollup(negativeWords, v => v.length, d => d);
  const politicsCounts = d3.rollup(politicsWords, v => v.length, d => d);
  const economyCounts = d3.rollup(economyWords, v => v.length, d => d);
  const countriesCounts = d3.rollup(countriesWords, v => v.length, d => d);
  const socialSecurityCounts = d3.rollup(socialSecurityWords, v => v.length, d => d);

  const sortedPositive = Array.from(positiveCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const sortedNegative = Array.from(negativeCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const sortedPolitics = Array.from(politicsCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const sortedEconomy = Array.from(economyCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const sortedCountries = Array.from(countriesCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const sortedSocialSecurity = Array.from(socialSecurityCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const positiveContainer = commonWordsContainer.append("div").attr("id", "positive-words");
  positiveContainer.append("h3").text("Top 10 Positive Words");

  const positiveList = positiveContainer.append("ul");
  sortedPositive.forEach(([word, count]) => {
    positiveList.append("li").text(`${word}: ${count}`);
  });

  const negativeContainer = commonWordsContainer.append("div").attr("id", "negative-words");
  negativeContainer.append("h3").text("Top 10 Negative Words");

  const negativeList = negativeContainer.append("ul");
  sortedNegative.forEach(([word, count]) => {
    negativeList.append("li").text(`${word}: ${count}`);
  });

  const politicsContainer = commonWordsContainer.append("div").attr("id", "politics-words");
  politicsContainer.append("h3").text("Top 10 Politics Words");

  const politicsList = politicsContainer.append("ul");
  sortedPolitics.forEach(([word, count]) => {
    politicsList.append("li").text(`${word}: ${count}`);
  });

  const economyContainer = commonWordsContainer.append("div").attr("id", "economy-words");
  economyContainer.append("h3").text("Top 10 Economy Words");

  const economyList = economyContainer.append("ul");
  sortedEconomy.forEach(([word, count]) => {
    economyList.append("li").text(`${word}: ${count}`);
  });

  const countriesContainer = commonWordsContainer.append("div").attr("id", "countries-words");
  countriesContainer.append("h3").text("Top 10 Countries Words");

  const countriesList = countriesContainer.append("ul");
  sortedCountries.forEach(([word, count]) => {
    countriesList.append("li").text(`${word}: ${count}`);
  });

  const socialSecurityContainer = commonWordsContainer.append("div").attr("id", "social-security-words");
  socialSecurityContainer.append("h3").text("Top 10 Social Security Words");

  const socialSecurityList = socialSecurityContainer.append("ul");
  sortedSocialSecurity.forEach(([word, count]) => {
    socialSecurityList.append("li").text(`${word}: ${count}`);
  });

  // Create a combined heat map for all categories
  const combinedData = [
    ...sortedPositive.map(d => ({ word: d[0], count: d[1], category: "Positive" })),
    ...sortedNegative.map(d => ({ word: d[0], count: d[1], category: "Negative" })),
    ...sortedPolitics.map(d => ({ word: d[0], count: d[1], category: "Politics" })),
    ...sortedEconomy.map(d => ({ word: d[0], count: d[1], category: "Economy" })),
    ...sortedCountries.map(d => ({ word: d[0], count: d[1], category: "Countries" })),
    ...sortedSocialSecurity.map(d => ({ word: d[0], count: d[1], category: "Social Security" }))
  ];

  const combinedContainer = app.append("div")
    .attr("id", "combined-heatmap")
    .style("position", "fixed")
    .style("left", "0")
    .style("top", "0")
    .style("width", "500px")
    .style("height", "100%")
    .style("overflow-y", "auto")
    .style("background-color", "#f9f9f9")
    .style("padding", "20px");

  combinedContainer.append("h3").text("Combined Heatmap of Top Words");

  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 500 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const svg = combinedContainer.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
    .range([0, width])
    .domain(combinedData.map(d => d.word))
    .padding(0.02);

  const y = d3.scaleBand()
    .range([height, 0])
    .domain(["Positive", "Negative", "Politics", "Economy", "Countries", "Social Security"])
    .padding(0.1);

  const color = d3.scaleSequential()
    .interpolator(d3.interpolateBlues)
    .domain([0, d3.max(combinedData, d => d.count)]);

  svg.selectAll()
    .data(combinedData, d => `${d.word}:${d.category}`)
    .enter()
    .append("rect")
    .attr("x", d => x(d.word))
    .attr("y", d => y(d.category))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", d => color(d.count))
    .select(".domain").remove();

  svg.selectAll("rect")
    .on("mouseover", function(event, d) {
      d3.select(this)
        .style("stroke", "black")
        .style("stroke-width", 2);

      const tooltip = svg.append("text")
        .attr("x", x(d.word) + x.bandwidth() / 2)
        .attr("y", y(d.category) - 10)
        .attr("text-anchor", "middle")
        .attr("class", "tooltip")
        .text(`${d.word}: ${d.count}`);
    })
    .on("mouseout", function() {
      d3.select(this)
        .style("stroke", "none");

      svg.selectAll(".tooltip").remove();
    });
};

displayCommonWords();
