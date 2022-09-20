import fs from "fs";
import recipes from "../../data/output.json";
// const recipesData = fs.readFileSync('../../data/output.json');

export default function handler(req, res) {

    if (req.method !== 'POST' || !req.body) {
        res.status(405).json({ message: 'Method not allowed' })
        return;
    }
        

    console.time("start");
    // parse json
    // var recipes = JSON.parse(recipesData.toString());

    const { recipeIndex, craftingTable} = req.body;

    const dayRecipe = recipes[recipeIndex];
    let parsedDayPattern = [];


    dayRecipe.pattern.forEach( row => {
    let parsedRow = [];
    row.split("").forEach( item => {
        if ( item === " " ) {
        parsedRow.push("empty");
        }
        for (var [key, value] of Object.entries(dayRecipe.key)) {
        if ( key === item ) {
            Object.entries(value).forEach( item => {
            parsedRow.push(item[1]);
            } );
        }
        }
    } );
    parsedDayPattern.push(parsedRow);
    } );
    // console.log("parsedDayPattern: ", parsedDayPattern);

    // console.log("craftingTable: ", craftingTable);
    console.timeEnd("start");
    if( craftingTable.every( (row,i) => row.every( (item,j) => item === parsedDayPattern[i][j] ) ) ){
    res.status(200).json({ success: true, recipe: dayRecipe });
    } else {
    res.status(200).json({ success: false });
    }

}
  