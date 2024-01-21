import * as rawDuplicates from '../results_duplicates_compact.json'
import * as fs from "fs";

let failedCount = 0;
let succeededCount = 0;
let duplicateEntries = Object.entries(rawDuplicates); //Import all entries and duplicates

/**
 * Define an entry from the duplicate list
 */
interface Item{
    path: string,
    size: number,
    modified_date: number,
    hash: any,
    symlink_info?: any
    similarity?: number
}

//Load all the duplicates in a list
let duplicates : Item[][] = [];
duplicateEntries.forEach(value => duplicates.push((value[1]/*[0]*/ as any[]).map(value => value as Item)));
let initialCount =  duplicates.length;

//Filter out where there are more than one duplicate
duplicates = duplicates.filter(value => (value.length <= 2));
failedCount = initialCount - duplicates.length;

//Remove the folders which are "default"
duplicates.forEach(items => {

    let defaultFolder = items.filter(value => value.path.match(/^.*Photos from [0-9]{4}.*$/gm));
    //defaultFolder = defaultFolder.filter(value => value.path.match(/^.*leanne takeout.*$/gm));


    /*
    let defaultFolder = items.sort((a, b) => b.size - a.size);
    if(defaultFolder.length == 2) defaultFolder.pop();
     */

    if(defaultFolder.length > 1) {
        //let paths = defaultFolder.map(value => value.path).join("\n");
        //console.warn(`\nDefault folder matched twice. Folders listed are: \n${paths}\n`);
        failedCount++;
        return;
    }else if(defaultFolder.length < 1) {
        //let paths = items.map(value => value.path).join("\n");
        //console.warn(`\nDefault folder not matched. Folders listed are: \n${paths}\n`);
        failedCount++;
        return;
    }

    succeededCount++;


    let deletingPath = defaultFolder[0].path;
    console.log("Deleting path " + defaultFolder[0].path)
    fs.unlink(deletingPath, (err)=> {
        if(err) {
            console.error("Unable to delete file with path " + deletingPath);
            ++failedCount;
        }
        else console.log("Successfully deleted: " + deletingPath)
    });
     
})

console.log(`Failed Count: ${failedCount}`)
console.log(`Succeeded Count: ${succeededCount}`)
