import * as __                          from "./tools/__";
import * as report                      from "./tools/logger"
import * as server_الكافي                  from "./server/الكافي";
import * as server_وسائل_الشيعة             from "./server/وسائل‌الشيعة";
import * as server_نهج_البلاغة              from "./server/نهج‌البلاغة";
import * as finder                      from "./tmp/rm/finder";
import * as appendix                    from "./tmp/rm/appendix";
import * as storage                     from "./tools/storage";
import * as tools                       from "./tools/tools";
import * as fs                          from "fs";
import * as TS                          from "./types/types";
import * as WS                          from "worker_threads";

// .. ====================================================================

let tmpFolder = "tmp/";

// .. ====================================================================

async function run () {

    let n_pad;
    let db: TS.db;

    // n_pad = await server_الكافي.ignite( "Cached", n_pad || 1 );
    // n_pad = await server_وسائل_الشيعة.ignite( "Cached", n_pad || 15414 );
    // n_pad = await server_نهج_البلاغة.ignite( "Cached", n_pad || 51282 );

    // .. merge all DBs
    db = [ ...server_الكافي.db, ...server_وسائل_الشيعة.db, ...server_نهج_البلاغة.db ];

    // // .. get db-s
    // __.db_db( db, await __.getFinalR( db ) );


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
