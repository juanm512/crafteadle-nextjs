import fs from "fs";

const recipesData = fs.readFileSync('./output.json');
const inventoriesData = fs.readFileSync('./inventories.json');
console.time("start");
// parse json
var recipes = JSON.parse(recipesData.toString());
var inventories = JSON.parse(inventoriesData.toString());
 
const date = new Date();
const index = date.getUTCDate()+date.getUTCMonth()+(date.getUTCMonth()*30);


console.log(recipes[index],'\n',inventories[index]);

console.timeEnd("start");