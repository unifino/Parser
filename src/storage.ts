import * as fs                          from "fs";
import * as TS                          from "./types";
import * as basic_tools                 from "./basic_tools";

// .. ======================================================================

export let db_kafi: TS.db = JSON.parse( fs.readFileSync( "src/db/base/Al-Kafi.json", 'utf8' ) );
export let db_misc: TS.db = JSON.parse( fs.readFileSync( "src/db/base/Misc.json", 'utf8' ) );
export let R: TS.r = JSON.parse( fs.readFileSync( "src/db/tunned/R.json", 'utf8' ) );
// export let clipBox: TS.bound = JSON.parse( fs.readFileSync( "src/db/tunned/clipBox.json", 'utf8' ) );
// export let boundBox: TS.bound = JSON.parse( fs.readFileSync( "src/db/tunned/boundBox.json", 'utf8' ) );
// export let boundBox_rest: TS.bound = JSON.parse( fs.readFileSync( "src/db/tunned/boundBox_rest.json", 'utf8' ) );
export let singles: number[] = JSON.parse( fs.readFileSync( "src/db/tunned/singles.json", 'utf8' ) );
export let doubles: TS.r = JSON.parse( fs.readFileSync( "src/db/tunned/doubles.json", 'utf8' ) );
// export let lastClip: TS.lastClip = JSON.parse( fs.readFileSync( "src/db/tunned/lastClip.json", 'utf8' ) );
export let multiples: number[][] = JSON.parse( fs.readFileSync( "src/db/tunned/multiples.json", 'utf8' ) );

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
) {
    // .. write down db
    path = "src/db/" + path + "/" + name + ".json";
    let data = JSON.stringify( db, null, "\t" );
    if ( beautify ) data = basic_tools.beautyJSON( data );
    fs.writeFileSync( path, data );
}

// .. ======================================================================
