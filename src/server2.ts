import * as tools                       from "./tools";
import * as TS                          from "./types";
import * as storage                     from "./storage";

const title = "-----Parser 2---";
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
// tools.do_charSpacer( storage.db_kafi );
tools.do_charSpacer( storage.db_misc );


                // .. from no on we have tunned DBs in Hand                 


//.. add some new properties to the DBs
// tools.addTmpProps( storage.db_kafi );
tools.addTmpProps( storage.db_misc );

let co = [];
let co_val;
for ( let i=0; i<storage.db_misc.length; i++ ) {
    // tools.timer( storage.db_misc.length, i, currentTime, startTime, title, version, quality, dupC );
    for ( let j=i+1; j<storage.db_misc.length; j++ ) {
        co_val = tools.correlationCalculator(i,j,storage.db_misc);
        if(co_val[2]>30) co.push(co_val);
    }
}

storage.info_save( co, "tunned", "correlations_"+"misc" );



// .. save results
storage.db_save( storage.db_misc, "tunned", "misc" );

// .. ======================================================================
console.log( "\n" );
console.timeEnd( "App Clock" );
console.log( "\n###-----Done!------###\n\n" );
// .. ======================================================================

