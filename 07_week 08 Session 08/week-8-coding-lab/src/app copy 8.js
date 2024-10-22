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

// Declare positiveWords and negativeWords globally
let positiveWords = [];
let negativeWords = [];

const processData = (data) => {
  positiveWords = [];
  negativeWords = [];
  const neutralWords = [];
  const politicsWords = [];
  const economyWords = [];
  const countriesWords = [];
  const socialSecurityWords = [];

  const politicsKeywords = ["government", "election", "policy", "president", "congress", "senate", "democracy", "republic", "campaign", "vote", "legislation", "law", "minister", "parliament", "diplomacy", "governance", "politician", "bureaucracy", "regulation", "administration", "cabinet", "judiciary", "constitution", "referendum", "lobbying", "political party", "state", "federal", "municipal", "executive", "judicial", "legislative"];
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


const app = d3.select('#app')
  .attr('calss','main')
  .style('display','flex');

  app.style('margin', '0 auto')
    .style('justify-content', 'center')
    .style('align-items', 'center')
    .style('height', '70vh');

  

const textDiv = app.append('div')
  .attr('class', 'text-div')
  .style('display', 'flex')
  .style('flex-direction', 'column')
  .style('padding', '1em')
  .style('gap', '1em'); // Add gap for spacing between elements

const createDropdown = async () => {
  const dropdownContainer = textDiv.append("div")
    .attr("id", "dropdown-container");

  const dropdown = dropdownContainer.append("select")
    .attr("id", "text-dropdown")
    .style("height", "auto")
    .style("width", "100%")
    .style("padding", "1em")
    .style("background", "black")
    .style("color","white")
    .style("border", "0.1em solid white")
    .style("appearance", "none")
    .style("-webkit-appearance", "none")
    .style("-moz-appearance", "none");

  dropdown.selectAll("option")
    .data(files.slice(1)) // Exclude the first option
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d.split('/').pop().replace('.txt', '').replace(/_/g, ' '))
    .style("background", "black")
    .style("color", "white")
    .style("padding", "1em");

  const fetchAndDisplayText = async (selectedFile) => {
    const text = await d3.text(selectedFile);
    d3.select("#text-content").text(text);
  };

  dropdown.on("change", async function() {

    const selectedFile = d3.select(this).property("value");
    await fetchAndDisplayText(selectedFile);
    const data = await fetchData();
    processData(data);

    // Highlight positive and negative words
    const textContent = d3.select("#text-content").text();
    const tokens = ri.tokenize(textContent);
    const highlightedText = tokens.map(token => {
      const lowerToken = token.toLowerCase();
      if (data.has(lowerToken)) {
      const sentimentScore = data.get(lowerToken).sentiment;
      if (sentimentScore > 0) {
        return `<span style="background: rgb(125,211,228);">${token}</span>`;
      } else if (sentimentScore < 0) {
        return `<span style="background: rgb(226,135,67);">${token}</span>`;
      }
      }
      return token;
    }).join(" ");

    d3.select("#text-content").html(highlightedText);
    
    // Remove the previous count container if it exists
    d3.select('.count-container').remove();

    const countContainer = textDiv.append('div')
      .attr('class', 'count-container')
      .style('padding-top', '1em');

    const maxWords = Math.max(positiveWords.length, negativeWords.length);

    countContainer.append('div')
      .attr('class', 'positive-count')
      .style('background', 'rgb(125,211,228)')
      .style('padding', '0.2em')
      .style('width', `${(positiveWords.length / maxWords) * 100}%`)
      .text(`Positive words: ${positiveWords.length}`);

    countContainer.append('div')
      .attr('class', 'negative-count')
      .style('background', 'rgb(226,135,67)')
      .style('padding', '0.2em')
      .style('width', `${(negativeWords.length / maxWords) * 100}%`)
      .text(`Negative words: ${negativeWords.length}`);

    // Remove the previous bubble chart if it exists
    d3.select('.bubble-chart-container').remove();

    const bubbleChartContainer = app.append('div')
      .attr('class','selected-div-viz')
      .attr('class', 'bubble-chart-container')
      .style('display', 'flex')
      .style('flex-direction', 'column')
      .style('padding', '2em');

    const bubbleChartSvg = bubbleChartContainer.append('svg')
      .attr('width', 1200)
      .attr('height', 750)
      .style('margin', '0 auto');

    const bubbleData = [
      ...positiveWords.map(word => ({ word, sentiment: 'positive' })),
      ...negativeWords.map(word => ({ word, sentiment: 'negative' }))
    ];

    const bubbleScale = d3.scaleSqrt()
      .domain([1, d3.max(bubbleData, d => d.word.length)])
      .range([5, 40]);

    const bubbleColor = d3.scaleOrdinal()
      .domain(['positive', 'negative'])
      .range(['rgb(125,211,228)', 'rgb(226,135,67)']);

    const bubbleSimulation = d3.forceSimulation(bubbleData)
      .force('charge', d3.forceManyBody().strength(10))
      .force('center', d3.forceCenter(bubbleChartSvg.attr('width') / 2, bubbleChartSvg.attr('height') / 2))
      .force('collision', d3.forceCollide().radius(d => bubbleScale(d.word.length) + 2))
      .on('tick', () => {
      const bubbles = bubbleChartSvg.selectAll('circle')
      .data(bubbleData);

      bubbles.enter().append('circle')
      .attr('r', d => bubbleScale(d.word.length))
      .attr('fill', d => bubbleColor(d.sentiment))
      .merge(bubbles)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

      bubbles.exit().remove();

      const labels = bubbleChartSvg.selectAll('text')
      .data(bubbleData);

      labels.enter().append('text')
      .attr('dy', '.3em')
      .style('text-anchor', 'middle')
      .text(d => d.word)
      .merge(labels)
      .attr('x', d => d.x)
      .attr('y', d => d.y);

      labels.exit().remove();
      });

    // Update the force center on resize
    window.addEventListener('resize', () => {
      const width = bubbleChartSvg.attr('width');
      const height = bubbleChartSvg.attr('height');
      bubbleSimulation.force('center', d3.forceCenter(width / 2, height / 2));
      bubbleSimulation.alpha(1).restart();
    });

    });

    // Display the first selected text on load with highlights
    const initialFile = files[1];
    dropdown.property("value", initialFile);
    await fetchAndDisplayText(initialFile);
    const initialData = await fetchData();
    processData(initialData);

    const initialTextContent = d3.select("#text-content").text();
    const initialTokens = ri.tokenize(initialTextContent);
    const initialHighlightedText = initialTokens.map(token => {
      const lowerToken = token.toLowerCase();
      if (initialData.has(lowerToken)) {
      const sentimentScore = initialData.get(lowerToken).sentiment;
      if (sentimentScore > 0) {
        return `<span style="background: rgb(125,211,228);">${token}</span>`;
      } else if (sentimentScore < 0) {
        return `<span style="background: rgb(226,135,67);">${token}</span>`;
      }
      }
      return token;
    }).join(" ");

    d3.select("#text-content").html(initialHighlightedText);

    // Remove the previous count container if it exists
    d3.select('.count-container').remove();

    const countContainer = textDiv.append('div')
      .attr('class', 'count-container')
      .style('padding-top', '1em');

    const maxWords = Math.max(positiveWords.length, negativeWords.length);

    countContainer.append('div')
      .attr('class', 'positive-count')
      .style('background', 'rgb(125,211,228)')
      .style('padding', '0.2em')
      .style('width', `${(positiveWords.length / maxWords) * 100}%`)
      .text(`Positive words: ${positiveWords.length}`);

    countContainer.append('div')
      .attr('class', 'negative-count')
      .style('background', 'rgb(226,135,67)')
      .style('padding', '0.2em')
      .style('width', `${(negativeWords.length / maxWords) * 100}%`)
      .text(`Negative words: ${negativeWords.length}`);

    // Remove the previous bubble chart if it exists
    d3.select('.bubble-chart-container').remove();

    const bubbleChartContainer = app.append('div')
      .attr('class','selected-div-viz')
      .attr('class', 'bubble-chart-container')
      .style('display', 'flex')
      .style('flex-direction', 'column')
      .style('padding', '2em');

    const bubbleChartSvg = bubbleChartContainer.append('svg')
      .attr('width', 1200)
      .attr('height', 750)
      .style('margin', '0 auto');

    const bubbleData = [
      ...positiveWords.map(word => ({ word, sentiment: 'positive' })),
      ...negativeWords.map(word => ({ word, sentiment: 'negative' }))
    ];

    const bubbleScale = d3.scaleSqrt()
      .domain([1, d3.max(bubbleData, d => d.word.length)])
      .range([5, 70]);

    const bubbleColor = d3.scaleOrdinal()
      .domain(['positive', 'negative'])
      .range(['green', 'red']);

    const bubbleSimulation = d3.forceSimulation(bubbleData)
      .force('charge', d3.forceManyBody().strength(10))
      .force('center', d3.forceCenter(bubbleChartSvg.attr('width') / 2, bubbleChartSvg.attr('height') / 2))
      .force('collision', d3.forceCollide().radius(d => bubbleScale(d.word.length) + 2))
      .on('tick', () => {
      const bubbles = bubbleChartSvg.selectAll('circle')
        .data(bubbleData);

      bubbles.enter().append('circle')
        .attr('r', d => bubbleScale(d.word.length))
        .attr('fill', d => bubbleColor(d.sentiment))
        .merge(bubbles)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      bubbles.exit().remove();

      const labels = bubbleChartSvg.selectAll('text')
        .data(bubbleData);

      labels.enter().append('text')
        .attr('dy', '.3em')
        .style('text-anchor', 'middle')
        .text(d => d.word)
        .merge(labels)
        .attr('x', d => d.x)
        .attr('y', d => d.y);

      labels.exit().remove();
      });

    // Update the force center on resize
    window.addEventListener('resize', () => {
      const width = bubbleChartSvg.attr('width');
      const height = bubbleChartSvg.attr('height');
      bubbleSimulation.force('center', d3.forceCenter(width / 2, height / 2));
      bubbleSimulation.alpha(1).restart();
    });
};

createDropdown();

textDiv.append("div")
  .attr("id", "text-content")
  .style("white-space", "pre-wrap")
  .style("height", "500px")
  .style("overflow-y", "scroll")
  .style("width", "500px")
  .style("scrollbar-width", "none") // For Firefox
  .style("-ms-overflow-style", "none"); // For Internet Explorer and Edge

// Hide scrollbar for WebKit browsers (Chrome, Safari)
textDiv.select("#text-content").node().style.cssText += '::-webkit-scrollbar { display: none; }';


