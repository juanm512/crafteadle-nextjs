import fs from "fs";


export default function handler(req, res) {

    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Method not allowed' })
        return;
    }
    const recipesData = fs.readFileSync('../../data/output.json');
    console.time("start");
    // parse json
    var recipes = JSON.parse(recipesData.toString());

    const date = new Date();
    const index = date.getUTCDate()+date.getUTCMonth()+(date.getUTCMonth()*30);

    const dayRecipe = recipes[index];

    res.status(200).json({ recipeName: dayRecipe.result.item })

    console.timeEnd("start");
}