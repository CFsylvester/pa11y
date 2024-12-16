const fs = require('fs');
const { Parser } = require('json2csv');

// Read the JSON file
const jsonData = fs.readFileSync('pa11y-results.txt', 'utf8');
const data = JSON.parse(jsonData);

// Convert JSON to CSV
const parser = new Parser();
const csvData = parser.parse(data);

// Write CSV to file
fs.writeFileSync('output.csv', csvData);