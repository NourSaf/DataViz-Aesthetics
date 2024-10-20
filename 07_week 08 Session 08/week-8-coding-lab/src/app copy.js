import * as d3 from "d3";
import { RiTa as rita } from "rita";
import Sentiment from "sentiment";

import { partsOfSpeech } from "./partsOfSpeech.js";

const sentiment = new Sentiment();

const sentimentScale = d3
  .scaleOrdinal()
  .domain(['positive','neutral','negative'])
  .range(['green','gray','red']);

const fetchData = async () => {
  const text = await d3.text("/text/Frankenstein.txt");
  //tokenize() return words. you can use different things 
  const tokens = rita.tokenize(text);
  console.log(tokens)
  return tokens;
};

const data = await fetchData();

const app = d3.select('#app');

// app.text(data);

//use another analysis functions for exapmle rita.pos(str, {simple:true})
// function calcSentimate(str){
//   const result = sentiment.analyze(str);
//   const score = result.score;
  
//   if (score > 0){
//     return 'positive'
//   } else if (score < 0) {
//     return 'negative'
//   } else {
//     return 'neutral'
//   }
// }

// app
// .selectAll('span')
// .data(data)
// .join('span').style('padding','2px')
// .text((d) => d)
// .style('color', (d) => {
//   const sentenceScore = calcSentimate(d)
//   return sentimentScale(sentenceScore)
// })

/*
step 01
tokanize the text in order to be able to access the desirable text. Say it's word/sentence or a line
this is achived by tokenize() functoin at RiTa website 
*/
function calcSentimate(str){
  if (str.toLowerCase() === 'frankenstein'){
    return 'names';
  }

  if (str.toLowerCase() === 'london'){
    return 'location';
  }

  // Check the dictionary
  const dict = {
    'location': ['london', 'united', 'states'],
    'names': ['frankenstein', 'mary' , 'globe','dream']
  };

  const categories = Object.keys(dict);
  for (const category of categories){
    if (dict[category].includes(str.toLowerCase())){
      return category;
    }
  }

  return 'neutral'; // Default category if no match found
}

app
  .selectAll('span')
  .data(data)
  .join('span')
  .style('padding', '2px')
  .text((d) => d)
  .style('color', (d) => {
    const category = calcSentimate(d);
    return sentimentScale(category);
  });