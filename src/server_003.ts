import * as SCT                         from "./server_common_tools";
import * as server001                   from "./server_001";
import * as server002                   from "./server_002";
import * as server003                   from "./server_003";
import * as storage                     from "./storage";
import * as tools                       from "./tools";
import * as fs                          from "fs";
import * as TS                          from "./types";

let name = "نهج‌الفصاحة";
export function ignite () {

    let filePath_db = "src/db/tmp/" + name + "/" + name + ".json";
    let filePath_patch = "src/db/tmp/" + name + "/" + "patches.json";
    // .. check
    fs.accessSync( filePath_db, fs.constants.R_OK );
    fs.accessSync( filePath_patch, fs.constants.R_OK );
    // .. get source
    let db: TS.db = JSON.parse( fs.readFileSync( filePath_db, 'utf8' ) );
    let patches: TS.db = JSON.parse( fs.readFileSync( filePath_patch, 'utf8' ) );
    for( let p of db ) if ( p.a ) p.a = SCT.some_edits(  p.a );
    for( let p of patches ) if ( p.a ) p.a = SCT.some_edits(  p.a );
    let n_pad = tools.n_allocation( db, 70000 );
    n_pad = tools.n_allocation( patches, 80000 );
    storage.saveData( patches, "src/db/tmp/" + name, "patches" );
    storage.saveData( db, "src/db/tmp/" + name, name );
    let R = SCT.R_R( patches, db );
    for( let p of R ) {
        if ( p[2] >= 67 ) {
            db.find( x => x.n === p[0] ).a = patches.find( x => x.n === p[1] ).a;
        }
    }
    let i = 0;
    for( let p of R ) {
        if ( p[2] >= 67 ) {
            i++
            try { patches.find( x => x.n === p[1] ).a = "hatef"  } catch {}
        }
    }
    console.log(i);
    patches = patches.filter( x => x.a && x.a !== "hatef" );
    tools.dbCleaner( patches );
    tools.dbCleaner( db );
    storage.saveData( patches, "src/db/source/" + name, "patches" );
    storage.saveData( db, "src/db/source/" + name, name );
    console.log(patches.length);
    storage.saveData( R, "src/db/tmp/", "R_1x2" );



}