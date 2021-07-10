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
let copy_db: TS.db;
let path = "source/mix-collection.json";
// .. read mix-db
let mix_db: TS.db = JSON.parse( fs.readFileSync( path, 'utf8' ) );
let copy_mix_db: TS.db = JSON.parse( fs.readFileSync( path, 'utf8' ) );

// .. ====================================================================

async function run () {

    let n_pad;

    // n_pad = await server_الكافي.ignite( "Cached", n_pad || 1 );
    // n_pad = await server_وسائل_الشيعة.ignite( "Cached", n_pad || 15414 );
    // n_pad = await server_نهج_البلاغة.ignite( "Cached", n_pad || 51282 );

    // .. merge all DBs
    // db = [ ...server_الكافي.db, ...server_وسائل_الشيعة.db, ...server_نهج_البلاغة.db ];
    db = server_وسائل_الشيعة.db;
    copy_db = JSON.parse( JSON.stringify( db ) );

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
        console.log(mix_db.length);

        for ( let i in mix_db ) {
            if ( !(Number(i) % 50) ) report.timer( Number(i), mix_db.length, time, 4 )
            await pick_make_one( mix_db[i] );
        }

        // .. save DBs
        storage.saveData( copy_mix_db, "source", "mix-collection" );
        storage.saveData( copy_db, "db", server_وسائل_الشيعة.name );

        console.log(copy_mix_db.length);

    }
    else console.log( "mix-db not Found!" );

}

// .. ====================================================================

async function pick_make_one ( item: TS.db_item, ) {

    let R = await tools.R_Searcher( item, db, true );

    let org: TS.db_item;
    let patch: TS.db_item;

    if ( R.length ) {

        R = R.reduce( (selected, nextOne) => {
            if ( nextOne[2] > selected[0][2] ) selected = [nextOne];
            return selected;
        } , [[0,0,0]] );

        org = copy_db.find( x => x.n === R[0][1] );
        patch = copy_mix_db.find( x => x.n === R[0][0] );

        // .. transfer some data
        if ( !org.b && patch.b ) org.b = patch.b;
        if ( org.c === null && patch.c !== null ) org.c = patch.c;

        // .. remove this cell
        copy_mix_db.splice( copy_mix_db.findIndex( x => x.n === R[0][0] ), 1 );

    }

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
