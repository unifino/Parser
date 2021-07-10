import * as fs                          from "fs";
import * as __                          from "./tools/__";
import * as report                      from "./tools/logger"
import * as server_الكافي                  from "./server/الكافي";
import * as server_وسائل_الشيعة             from "./server/وسائل‌الشيعة";
import * as server_نهج_البلاغة              from "./server/نهج‌البلاغة";
import * as storage                     from "./tools/storage";
import * as tools                       from "./tools/tools";
import * as TS                          from "./types/types";
import * as WS                          from "worker_threads";

// .. ====================================================================

let tmpFolder = "tmp/";
let db: TS.db;
let path = "source/mix-collection.json";
// .. read mix-db
let mix_db: TS.db = JSON.parse( fs.readFileSync( path, 'utf8' ) );

// .. ====================================================================

async function run () {

    let n_pad;

    // n_pad = await server_الكافي.ignite( "Cached", n_pad || 1 );
    // n_pad = await server_وسائل_الشيعة.ignite( "Cached", n_pad || 15414 );
    // n_pad = await server_نهج_البلاغة.ignite( "Cached", n_pad || 51282 );

    // .. merge all DBs
    db = [ ...server_الكافي.db, ...server_وسائل_الشيعة.db, ...server_نهج_البلاغة.db ];

    // // .. get db-s
    // __.db_db( db, await __.getFinalR( db ) );

    await picker_maker();

}

// .. ====================================================================

async function picker_maker () {

    let time = new Date().getTime();

    // .. return cached
    if ( fs.existsSync( path ) ) {

        // .. prepare DBs
        db = tools.addTmpProps( db );
        mix_db = tools.addTmpProps( mix_db );

        for ( let i in mix_db.slice(0,10) ) {
            report.timer( Number(i), mix_db.length, time, 4 )
            pick_make_one( mix_db[i] );
        }

    }
    else console.log( "mix-db not Found!" );

}

// .. ====================================================================

async function pick_make_one ( item: TS.db_item, ) {


    let R = await tools.R_Searcher( item, db, false );
    if ( R ) console.log("hatef");
    // storage.saveData( mix_db, "source", "mix-collection" )


}

// .. ====================================================================

// .. major init function
( async function self_ignite () {
    // .. reset terminal
    console.clear();
    // .. create title
    report.notify();
    // .. actual steps goes here:
    await run();
    // .. wait a bit
    await new Promise( _ => setTimeout( _, 700 ) );
    // .. end of the application
    report.notify( null, true );
    report.clock();
    // .. done.
} )();

// .. ====================================================================
