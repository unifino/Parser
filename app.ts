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
    // n_pad = await server_الكافي.ignite( "Cached", n_pad || 1 );
    // n_pad = await server_وسائل_الشيعة.ignite( "Cached", n_pad || 15414 );
    // n_pad = await server_نهج_البلاغة.ignite( "Cached", n_pad || 51282 );

    // .. Mutual-R
    let final_name = "نهاية";
    let final_path = tmpFolder + final_name + "-R.json";
    let final_R = await __.R_wrapper(
        final_path,
        [ server_الكافي.db, server_وسائل_الشيعة.db, server_نهج_البلاغة.db ].slice(2),
        tmpFolder,
        final_name
    );


}

// .. ====================================================================

function getFiles (): [ TS.R[], TS.db_item[] ] {

    server_الكافي.resource_update();
    server_وسائل_الشيعة.resource_update();
    server_نهج_البلاغة.resource_update();

    // .. get Rs
    let RR_1 = server_الكافي.R;
    let RR_2 = server_وسائل_الشيعة.R;
    let RR_3 = server_نهج_البلاغة.R;

    // .. optimize Rs
    let R = [ ...RR_1, ...RR_2, ...RR_3 ];
    let R_R__ = tools.R_optimizer ( R, 67 );

    // .. merge db_s **
    let db = [
        ...server_الكافي.db,
        ...server_وسائل_الشيعة.db,
        ...server_نهج_البلاغة.db 
    ];

    return [ R_R__, db ];

}

// .. ====================================================================

async function db_db () {

    let R_R__: TS.R[];
    let db: TS.db_item[];

    [ R_R__, db ] = getFiles();

    // .. get preparations
    // __._db_( R_R__, db, tmpFolder );

    // .. check result
    await tools._db_check_( tmpFolder, db );

    // .. get relations in one BIG DB
    db = tools.relation_definer( tmpFolder, db );

    // .. save DBs | divide them ***
    let n1 = server_الكافي.db.length; let c1 = n1;
    let n2 = server_وسائل_الشيعة.db.length; let c2 = n1 + n2;
    let n3 = server_نهج_البلاغة.db.length; let c3 = n1 + n2 + n3;
    storage.saveData( db.slice( 0,  c1 ), "db/ready", server_الكافي.name );
    storage.saveData( db.slice( c1, c2 ), "db/ready", server_وسائل_الشيعة.name );
    storage.saveData( db.slice( c2, c3 ), "db/ready", server_نهج_البلاغة.name );

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
