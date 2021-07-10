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

    // .. define N-Pad
    let n_pad;
    let db: TS.db;
    // n_pad = await server_الكافي.ignite( "Cached", n_pad || 1 );
    // n_pad = await server_وسائل_الشيعة.ignite( "Cached", n_pad || 15414 );
    // n_pad = await server_نهج_البلاغة.ignite( "Cached", n_pad || 51282 );
    // .. merge all DBs
    db = [ ...server_الكافي.db, ...server_وسائل_الشيعة.db, ...server_نهج_البلاغة.db ];

    // // .. get db-s
    // db_db( db, await getFinalR( db ) );

    

}

// .. ====================================================================

async function getFinalR ( db: TS.db ) {
    let final_name = "نهاية";
    let final_path = tmpFolder + final_name + "-R.json";
    let final_R = await __.R_wrapper( final_path, db );
    return final_R;
}

// .. ====================================================================

async function db_db ( db: TS.db, R: TS.R[] ) {

    // .. search for optimizing
    __.cook( R, db, tmpFolder );
    // .. check result
    await tools._db_check_( tmpFolder, db );
    // .. get relations in one BIG DB
    db = tools.relation_definer( tmpFolder, db );
    // .. save DBs | divide them ***
    let n1 = server_الكافي.db.length; let c1 = n1;
    let n2 = server_وسائل_الشيعة.db.length; let c2 = n1 + n2;
    let n3 = server_نهج_البلاغة.db.length; let c3 = n1 + n2 + n3;
    storage.saveData( db.slice( 0,  c1 ), "db", server_الكافي.name );
    storage.saveData( db.slice( c1, c2 ), "db", server_وسائل_الشيعة.name );
    storage.saveData( db.slice( c2, c3 ), "db", server_نهج_البلاغة.name );

    // .. clean the tmpFolder
    __.janitor( tmpFolder );

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
