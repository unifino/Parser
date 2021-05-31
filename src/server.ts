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



// for ( let line of storage.doubles ) {
//     // if ( line.length > 4 && line.length < 7 ) {
//         // for ( let x of line ) 
//         console.log( [...storage.db_kafi,...storage.db_misc ][line[0]].a );
//         console.log( [...storage.db_kafi,...storage.db_misc ][line[1]].a );
//         console.log("\n\n\n");
//     // }
// }
// for ( let line of storage.doubles ) {
//     if ( storage.R.find( x => x[0] === line[0] && x[1] === line[1] )[2] < 55 ) {
//         console.log( [...storage.db_kafi,...storage.db_misc ][line[0]].a );
//         console.log( [...storage.db_kafi,...storage.db_misc ][line[1]].a );
//         console.log("\n\n\n");
//     }
    
// }

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

