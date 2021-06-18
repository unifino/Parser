import * as fs                          from "fs";
import * as TS                          from "./types";
import * as basic_tools                 from "./basic_tools";

// .. ======================================================================

export function db_save ( db: TS.db, path: string, name: TS.source ) {
    // .. write down db
    path = "src/db/" + path + "/" + name + ".json";
    fs.writeFileSync( path, JSON.stringify( db, null, "\t" ) );
}

// .. ======================================================================

export function db_replace ( db: TS.db, name: TS.source ) {
    // .. write down db
    let path = "../Moshaf/src/db/H/" + name + ".json";
    fs.writeFileSync( path, JSON.stringify( db, null, "\t" ) );
}

// .. ======================================================================

export function tmp_save (
    db: []|{},
    path: string,
    name: string,
    beautify?: boolean
)
{
    // .. write down db
    path = path + "/" + name + ".json";
    let data = JSON.stringify( db, null, "\t" );
    if ( beautify ) data = basic_tools.beautyJSON( data );
    fs.writeFileSync( path, data );
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
