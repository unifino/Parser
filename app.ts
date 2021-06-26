import * as __                          from "./tools/__";
import * as server001                   from "./server/server_001";
import * as server002                   from "./server/server_002";
import * as server003                   from "./server/server_003";
import * as finder                      from "./tmp/finder";
import * as appendix                    from "./tmp/appendix";
import * as storage                     from "./tools/storage";
import * as tools                       from "./tools/tools";
import * as fs                          from "fs";
import * as TS                          from "./types/types";

// .. ====================================================================

let tmpFolder = "db/tmp/";

// .. ====================================================================

console.clear();

// .. ====================================================================

async function run () {
    console.log("hatef");
}

// .. ====================================================================

// .. major init function
( async function self_ignite () {
    // .. create title
    tools.notify();
    // .. capture time
    console.time( "App Clock" );
    // .. actual steps goes here:
    await run();
    // .. end of the application
    tools.notify( null, true );
    // .. done.
} )();

// .. ====================================================================

// function getFiles (): [ TS.R[], TS.db_item[] ] {

//     // .. define path *
//     let RR_1_Path = server001.tmpFolder + "RR.json";
//     let RR_2_Path = server002.tmpFolder + "RR.json";
//     let RR_3_Path = server003.tmpFolder + "RR.json";
//     let RX_2_Path = tmpFolder + "RX_2.json";
//     let RX_3_Path = tmpFolder + "RX_3.json";

//     // .. get Rs
//     let RR_1 = JSON.parse( fs.readFileSync( RR_1_Path, 'utf8' ) );
//     let RR_2 = JSON.parse( fs.readFileSync( RR_2_Path, 'utf8' ) );
//     let RR_3 = JSON.parse( fs.readFileSync( RR_3_Path, 'utf8' ) );
//     let RX_2 = JSON.parse( fs.readFileSync( RX_2_Path, 'utf8' ) );
//     let RX_3 = JSON.parse( fs.readFileSync( RX_3_Path, 'utf8' ) );

//     // .. optimize Rs
//     let R = [ ...RR_1, ...RR_2, ...RR_3, ...RX_2, ...RX_3 ];
//     let R_R__ = tools.R_optimizer ( R, 67 );

//     server001.resource_update();
//     server002.resource_update();
//     server003.resource_update();

//     // .. merge db_s **
//     let db = [
//         ...server001.db,
//         ...server002.db,
//         ...server003.db 
//     ];

//     return [ R_R__, db ];

// }

// .. ====================================================================

// async function _dbdb_ () {

//     let R_R__: TS.R[];
//     let db: TS.db_item[];

//     [ R_R__, db ] = getFiles();

//     // .. get preparations
//     __._db_( R_R__, db, tmpFolder );

//     // .. check result
//     await tools._db_chcek_( tmpFolder, db );

//     // .. get relations in one BIG DB
//     db = tools.relation_definer( tmpFolder, db );

//     // .. save DBs | divide them ***
//     let n1 = server001.db.length; let c1 = n1;
//     let n2 = server002.db.length; let c2 = n1 + n2;
//     let n3 = server003.db.length; let c3 = n1 + n2 + n3;
//     storage.saveData( db.slice( 0,  c1 ), "db/ready", server001.name );
//     storage.saveData( db.slice( c1, c2 ), "db/ready", server002.name );
//     storage.saveData( db.slice( c2, c3 ), "db/ready", server003.name );

//     // .. clean the tmpFolder
//     __.janitor( tmpFolder );

// }

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
// let R = __.R_R( server002.db, server001.db );
// storage.saveData( R, "db/tmp/", "RX_2" );
// // .. Mutual-R
// let R = __.R_R( server003.db, [ ...server001.db, ...server002.db ] );
// storage.saveData( R, "db/tmp/", "RX_3" );

// // .. optimizing: search & check & save
// _dbdb_();

// finder.init();

// .. ====================================================================
