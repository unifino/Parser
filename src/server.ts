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



// let total = Object.keys( storage.boundBox ).length;
// let exp = tools.boundBoxDivider_SD( storage.boundBox )
// storage.info_save( exp.rest, "tunned", "boundBox_rest", true );
// storage.info_save( exp.singles, "tunned", "singles", true );
// storage.info_save( exp.doubles, "tunned", "doubles", true );

// console.log( 
//     Object.keys( exp.rest ).length 
//     + exp.singles.length
//     + exp.doubles.length*2 
//     - total 
// );

// storage.info_save( exp.doubles, "tunned", "doubles", true );
// storage.info_save( exp.singles, "tunned", "singles", true );
// storage.info_save( exp.rest, "tunned", "boundBox_rest", true );

let total = Object.keys( storage.boundBox ).length;
console.log( 
    Object.keys( storage.boundBox_rest ).length 
    + storage.singles.length
    + storage.doubles.length*2 
    - total 
);


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

