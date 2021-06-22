import * as SCT                         from "./server_common_tools";
import * as server001                   from "./server_001";
import * as server002                   from "./server_002";
import * as server003                   from "./server_003";
import * as storage                     from "./storage";
import * as tools                       from "./tools";
import * as fs                          from "fs";
import * as TS                          from "./types";

// .. ======================================================================

let tmpFolder = "src/db/tmp/";
let R_Path: string;
let R_R: TS.R[];
let R_R__: TS.R[];

// .. ======================================================================

console.clear();

// .. ======================================================================

// .. major init function
async function ignite () {
    // .. create title
    tools.notify();
    // .. capture time
    console.time( "App Clock" );

    // .. actual steps goes here:

        server003.init( "Scratch" );

        // let n_pad: number;
        // // .. ignite server 001 | n_pad: 1 => 15413
        // await server001.ignite( "Cached", 1 ).then( n => n_pad = n );
        // // .. ignite server 002 | n_pad: 15414 => 51281 ( 15413 + 35868 )
        // await server002.ignite( "Cached", n_pad ).then( n => n_pad = n );
        // // // .. Self-R
        // // SCT._R_( server001.db_v1, server001.tmpFolder );
        // // SCT._R_( server002.db_v1, server002.tmpFolder );
        // // .. update files
        // server001.resource_update();
        // server002.resource_update();
        // // // .. Mutual-R
        // // let R = SCT.R_R( server001.db, server002.db );
        // // storage.saveData( R, "src/db/tmp/", "R_1x2" );
        // // .. optimizing: search & check & save
        // _dbdb_();

    // .. end of the application
    tools.notify( null, true );

}

ignite();

// .. ======================================================================

async function _dbdb_ () {
    // .. define path
    R_Path = tmpFolder + "R_1x2.json";
    // .. get R_R
    R_R = JSON.parse( fs.readFileSync( R_Path, 'utf8' ) );
    // .. optimize R_R
    R_R__ = tools.R_optimizer ( R_R, 67 );
    // .. merge db_s
    let d_db = [ ...server001.db, ...server002.db ];
    // .. get preparations
    SCT._db_( R_R__, d_db, tmpFolder );
    // .. check result
    await tools._db_chcek_( tmpFolder, d_db );
    // .. get relations in one BIG DB
    let db_u = tools.relation_definer( tmpFolder, d_db );
    // .. save DBs | divide them
    let n1 = server001.db.length;
    let n2 = server002.db.length;
    storage.saveData( db_u.slice( 0, n1 ), "src/db/ready", server001.name  );
    storage.saveData( db_u.slice( n1, n1+n2 ), "src/db/ready", server002.name );
    // .. clean the tmpFolder
    SCT.janitor( tmpFolder );
}

// .. ======================================================================
