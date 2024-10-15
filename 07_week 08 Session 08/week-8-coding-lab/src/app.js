import * as d3 from "d3";
import { RiTa } from "rita";
import Sentiment from "sentiment";

import { partsOfSpeech } from "./partsOfSpeech.js";

const sentiment = new Sentiment();

const fetchData = async () => {
  const text = await d3.text("/text/Frankenstein.txt");

  return text;
};

const data = await fetchData();

const app = d3.select('#app');

app.text(data);