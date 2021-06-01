import * as fs                          from "fs";
import * as TS                          from "./types";
import * as basic_tools                 from "./basic_tools";

// .. ======================================================================

export let db_kafi: TS.db;
export let db_misc: TS.db;
export let R: TS.R[];
export let single: TS.s;
export let double: TS.d;
export let multi: TS.m;
export let grand_db: TS.db;

// .. ======================================================================

export function update () {
    db_kafi = JSON.parse(fs.readFileSync("src/db/base/Al-Kafi.json",'utf8'));
    db_misc = JSON.parse(fs.readFileSync("src/db/base/Misc.json",'utf8'));
    R       = JSON.parse(fs.readFileSync("src/db/ready/R.json",'utf8'));
    try {
        single  = JSON.parse(fs.readFileSync("src/db/tunned/single.json",'utf8'));
        double  = JSON.parse(fs.readFileSync("src/db/tunned/double.json",'utf8'));
        multi   = JSON.parse(fs.readFileSync("src/db/tunned/multi.json",'utf8'));
    } catch {}
    grand_db = [ ...db_kafi, ...db_misc ];
}

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
