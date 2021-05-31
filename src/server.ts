import * as tools                       from "./tools";
import * as TS                          from "./types";
import * as storage                     from "./storage";

const title = "-----Parser 1---";
const version = "2.0.0";
console.clear();
console.log( "###" +title +"###\n###-----v." +version +"----###\n" );

// .. ======================================================================
console.time( "App Clock" );
// .. ======================================================================

// .. do update DBs
tools.do_charSpacer( storage.db_kafi );
tools.do_charSpacer( storage.db_misc );


// ..                 from no on we have tunned DBs in Hand                 
//..........................................................................


// ..
// ..
// ..
// ..
// ..
// ..
// ..
// ..
// ..
// ..


// .. allocate j index
tools.jAllocator( storage.db_kafi, storage.db_misc );


// .. save results
storage.db_save( storage.db_kafi, "ready", "Al-Kafi" );
storage.db_save( storage.db_misc, "ready", "misc" );
// storage.info_save( clipBox, "tunned", "clipBox", true );
// [...storage.db_kafi,...storage.db_misc ]



// .. ======================================================================
console.log( "\n" );
console.timeEnd( "App Clock" );
console.log( "\n###-----Done!------###\n\n" );
// .. ======================================================================

