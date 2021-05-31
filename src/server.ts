import * as tools                       from "./tools";
import * as TS                          from "./types";
import * as storage                     from "./storage";

const title = "-----Parser 1---";
const version = "2.0.0";
console.clear();
console.log( "###" +title +"###\n###-----v." +version +"----###\n" );

// .. ======================================================================

let startTime = new Date().getTime(), 
    currentTime = new Date().getTime();

let quality = 100;
let dupC = 0;

// .. ======================================================================
console.time( "App Clock" );
// .. ======================================================================

// .. do update DBs
tools.do_charSpacer( storage.db_kafi );
tools.do_charSpacer( storage.db_misc );


                // .. from no on we have tunned DBs in Hand                 





// [...storage.db_kafi,...storage.db_misc]
// storage.info_save( clipBox, "tunned", "clipBox", true );


// .. save results
storage.db_save( storage.db_kafi, "tunned", "Al-Kafi" );
storage.db_save( storage.db_misc, "tunned", "misc" );

// .. ======================================================================
console.log( "\n" );
console.timeEnd( "App Clock" );
console.log( "\n###-----Done!------###\n\n" );
// .. ======================================================================

