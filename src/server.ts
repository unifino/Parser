import * as fs                          from "fs";
import * as tools                       from "./tools";
import * as TS                          from "./types";

const title = "... Parser";
const version = "2.0.0";
console.clear();
console.log( "### " + title + " ### ###    v." + version + "    ###\n" );

// .. ======================================================================

let db_kafi: TS.db = JSON.parse( fs.readFileSync( "src/db/base/Al-Kafi.json", 'utf8' ) );
let db_misc: TS.db = JSON.parse( fs.readFileSync( "src/db/base/Misc.json", 'utf8' ) );
let db_misc_copy: TS.db = JSON.parse( fs.readFileSync( "src/db/base/Misc2.json", 'utf8' ) );

let startTime = new Date().getTime(), 
    currentTime = new Date().getTime();

let quality = 100;
let dupC = 0;

// .. ======================================================================
console.time( "App" );
// .. ======================================================================

tools.do_charSpacer( db_kafi );
tools.do_charSpacer( db_misc );
tools.do_charSpacer( db_misc_copy );
for ( let i in db_misc_copy ) {
    if ( db_misc_copy[i].d !== db_misc[i].d )
        console.log( (db_misc[i] as any ).i );
        
}

// .. ======================================================================
console.timeEnd( "App" ); console.log( "###     Done!     ###\n\n" );
// .. ======================================================================