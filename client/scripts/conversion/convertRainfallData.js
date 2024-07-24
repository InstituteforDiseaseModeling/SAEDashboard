
'use strict'

const fs = require('fs');
const {csvJSON} = require('./util.js');



// input csv file 
const inputcsv = fs.readFileSync('./SEN_Rain_2018_2023.csv', 'utf8');

// convert csv to json
const inputJson = csvJSON(inputcsv);
const outputJson = [];

for (let i = 0; i < inputJson.length; i++) {
  const element = inputJson[i];

  if (element['Month'] != 'Total') {
    element['Rainfall_mm'] = parseFloat(element['Rainfall_mm']);
    element['Month'] = parseInt(element['Month'])-1;
    element['Year'] = parseInt(element['Year']);
    outputJson.push(element);
  }

}

fs.writeFile("rainfall_2018_2023.json", JSON.stringify(outputJson), ()=>{});

// // convert json to csv
// const csvresult = converter.json2csv(inputJson);

// fs.writeFile("fixed admin2 names.csv", csvresult, ()=>{});







