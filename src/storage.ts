import * as fs                          from "fs";
import * as TS                          from "./types";

// .. ======================================================================

export let db_kafi: TS.db = JSON.parse( fs.readFileSync( "src/db/base/Al-Kafi.json", 'utf8' ) );
export let db_misc: TS.db = JSON.parse( fs.readFileSync( "src/db/base/Misc.json", 'utf8' ) );

// .. ======================================================================

export function db_save ( db: TS.db, path: string, name: TS.source ) {
    // .. write down db
    path = "src/db/" + path + "/" + name + ".json";
    fs.writeFileSync( path, JSON.stringify( db, null, "\t" ) );
}

// .. ======================================================================

export function info_save ( db: TS.db, path: string, name: string ) {
    // .. write down db
    path = "src/db/" + path + "/" + name + ".json";
    fs.writeFileSync( path, JSON.stringify( db, null, "\t" ) );
}

// .. ======================================================================
