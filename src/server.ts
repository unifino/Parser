import * as __                          from "./server_common_tools";
import * as server001                   from "./server_001";
import * as server002                   from "./server_002";
import * as server003                   from "./server_003";
import * as finder                      from "./finder";
import * as storage                     from "./storage";
import * as tools                       from "./tools";
import * as fs                          from "fs";
import * as TS                          from "./types";

// .. ====================================================================

let tmpFolder = "src/db/tmp/";

// .. ====================================================================

console.clear();

// .. ====================================================================

// .. major init function
async function ignite () {
    // .. create title
    tools.notify();
    // .. capture time
    console.time( "App Clock" );

    // .. actual steps goes here:

        // .. optimizing: search & check & save
        _dbdb_();

        // finder.init();

    // .. end of the application
    tools.notify( null, true );

}

ignite();

// .. ====================================================================

function getFiles (): [ TS.R[], TS.db_item[] ] {

    // .. define path *
    let R_Path_1 = server001.tmpFolder + "RR.json";
    let R_Path_2 = server002.tmpFolder + "RR.json";
    let R_Path_1x2 = tmpFolder + "R_1x2.json";
    let R_Path_1x3 = tmpFolder + "R_1x3.json";

    // .. get R_R
    let R_R_1 = JSON.parse( fs.readFileSync( R_Path_1, 'utf8' ) );
    let R_R_2 = JSON.parse( fs.readFileSync( R_Path_2, 'utf8' ) );
    let R_R_1x2 = JSON.parse( fs.readFileSync( R_Path_1x2, 'utf8' ) );
    let R_R_1x3 = JSON.parse( fs.readFileSync( R_Path_1x3, 'utf8' ) );

    // .. optimize R_R
    let R_R__ = tools.R_optimizer ( [
        ...R_R_1,
        ...R_R_2,
        ...R_R_1x2,
        ...R_R_1x3,
    ], 67 );

    // .. merge db_s **
    server001.resource_update();
    server002.resource_update();
    server003.resource_update();
    let d_db = [
        ...server001.db,
        ...server002.db,
        ...server003.db 
    ];

    return [ R_R__, d_db ];

}

// .. ====================================================================

async function _dbdb_ () {

    let R_R__: TS.R[];
    let d_db: TS.db_item[];

    [ R_R__, d_db ] = getFiles();

    // .. get preparations
    __._db_( R_R__, d_db, tmpFolder );

    // .. check result
    await tools._db_chcek_( tmpFolder, d_db );

    // .. get relations in one BIG DB
    let db_u = tools.relation_definer( tmpFolder, d_db );

    // .. save DBs | divide them ***
    let n1 = server001.db.length;
    let n2 = server002.db.length;
    let n3 = server003.db.length;
    storage.saveData( db_u.slice( 0, n1 ), "src/db/ready", server001.name  );
    storage.saveData( db_u.slice( n1, n1+n2 ), "src/db/ready", server002.name );
    storage.saveData( db_u.slice( n1+n2, n1+n2+n3 ), "src/db/ready", server003.name );

    // .. clean the tmpFolder
    __.janitor( tmpFolder );

}

// .. ====================================================================

// let n_pad: number;
// // .. ignite server 001 | n_pad: 1 => 15413
// await server001.ignite( "Cached", 1 ).then( n => n_pad = n );
// // .. ignite server 002 | n_pad: 15414 => 51281 ( 15413 + 35868 )
// await server002.ignite( "Cached", n_pad ).then( n => n_pad = n );
// // .. ignite server 003 | n:pad: 51281 => 52564 ( 51281 + 1 + 1283 )
// await server003.ignite( "Cached", n_pad ).then( n => n_pad = n );
// // .. Self-R
// __._R_( server001.db_v1, server001.tmpFolder );
// __._R_( server002.db_v1, server002.tmpFolder );
// __._R_( server003.db_v1, server003.tmpFolder );
// // .. update files
// server001.resource_update();
// server002.resource_update();
// server003.resource_update();

// // .. Mutual-R
// let R = __.R_R( server003.db, [ ...server001.db, ...server002.db ] );
// storage.saveData( R, "src/db/tmp/", "R_1x3" );

// // .. optimizing: search & check & save
// _dbdb_();

// .. ====================================================================
