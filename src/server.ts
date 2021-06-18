import * as dbExporter                  from "./server_db_exporter";
import * as serverXXX                   from "./server_XXX";
import * as server001                   from "./server_001";
import * as server002                   from "./server_002";
import * as storage                     from "./storage";
import * as tools                       from "./tools";
import * as fs                          from "fs";
import * as TS                          from "./types";

// .. ======================================================================

// .. major init function
async function ignite () {
    // .. create title
    tools.notify();
    // .. capture time
    console.time( "App Clock" );

    // .. actual steps goes here:

        // await server001.ignite( "Cached" );
        await server002.ignite( "Cached" );

    // .. end of the application
    tools.notify( null, true );

}

ignite();

// .. ======================================================================

function R_R () {

    // .. load db
    let db_001_Path = "src/db/tmp/الكافي/01.json";
    let db_002_Path = "src/db/tmp/وسائل‌الشيعة/01.json";
    let db_001: TS.db = JSON.parse( fs.readFileSync( db_001_Path, 'utf8' ) );
    let db_002: TS.db = JSON.parse( fs.readFileSync( db_002_Path, 'utf8' ) );

    let R: TS.R[] = [];

    // .. [addTmpProps]
    tools.addTmpProps( db_001 );
    tools.addTmpProps( db_002 );
    for ( let cell of db_001 ) { 
        cell.j = cell.d as number; 
        cell.n = cell.d as number; 
    }
    for ( let cell of db_002 ) { 
        cell.j = cell.d as number; 
        cell.n = cell.d as number; 
    }

    R = tools.R_old( db_002, db_001, false );
    fs.writeFileSync( "src/db/tmp/R12.json", JSON.stringify(R) );

}

// .. ======================================================================
