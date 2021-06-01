import * as fs                          from "fs";
import * as TS                          from "./types";
import * as basic_tools                 from "./basic_tools";

// .. ======================================================================

export let db_kafi: TS.db = JSON.parse( fs.readFileSync(
    "src/db/base/Al-Kafi.json", 'utf8' ) );
export let db_misc: TS.db = JSON.parse( fs.readFileSync(
    "src/db/base/Misc.json", 'utf8' ) );
export let R: TS.R[] = JSON.parse( fs.readFileSync(
    "src/db/ready/R.json", 'utf8' ) );
export let single: number[] = JSON.parse( fs.readFileSync(
    "src/db/tunned/single.json", 'utf8' ) );
export let double: TS.d = JSON.parse( fs.readFileSync( 
    "src/db/tunned/double.json", 'utf8' ) );
export let multiBound: TS.boundBox = JSON.parse( fs.readFileSync( 
    "src/db/tunned/multiBound.json", 'utf8' ) );
export let multi: TS.m = JSON.parse( fs.readFileSync( 
    "src/db/tunned/multi.json", 'utf8' ) );

export let grand_db: TS.db = [ ...db_kafi, ...db_misc ];


// .. ======================================================================

export function db_save ( db: TS.db, path: string, name: TS.source ) {
    // .. write down db
    path = "src/db/" + path + "/" + name + ".json";
    fs.writeFileSync( path, JSON.stringify( db, null, "\t" ) );
}

// .. ======================================================================

export function info_save (
    db: []|{},
    path: string,
    name: string,
    beautify?: boolean
)
{
    // .. write down db
    path = "src/db/" + path + "/" + name + ".json";
    let data = JSON.stringify( db, null, "\t" );
    if ( beautify ) data = basic_tools.beautyJSON( data );
    fs.writeFileSync( path, data );
}

// .. ======================================================================
